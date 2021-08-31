<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center bg-gray-50">
        <SearchBar ref="search" class="flex flex-col"
            @processPlaylist="processPlaylist($event)"
            @processVideo="processVideo($event)"
            @resetSearchResults="resetSearchResults()"
            @setSearchStatus="setSearchStatus($event)"
            @setMode="setMode($event)"
            :searchUrl="searchUrl"
        />
        <div v-if="searchStatus === 102" class="flex flex-col flex-grow items-center justify-center">
            <div class="multi-ripple h-28 w-28">
                <div></div>
                <div></div>
            </div>
            <div>
                <p class="text-sm text-gray-500">Getting playlist details..</p>
            </div>
        </div>
        <div v-else-if="searchStatus === 204" class="flex flex-col flex-grow items-center justify-center">
            <p>Looks like you're having a lucky day!<br>All your playlist videos are visible!</p>
        </div>
        <div v-else-if="searchStatus === 206" class="flex flex-col flex-grow items-center justify-center">
            <p>Looks like your playlist is empty!<br>Coudn't find any videos in there!</p>
        </div>
        <div v-else-if="searchStatus === 404" class="flex flex-col flex-grow items-center justify-center">
            <p>Could not find the Playlist mentioned.<br>Make sure the playlist is public or unlisted and try again!</p>
        </div>
        <div v-else-if="searchStatus === 500" class="flex flex-col flex-grow items-center justify-center">
            <p>Error getting playlist details :(<br> Reach out to me on <a href="https://twitter.com/shubham_nh">Twitter</a> if this persists!</p>
        </div>

        <div v-if="searchStatus === 200 && searchMode === 'playlist'" class="flex flex-row items-end pt-4 pb-3 lg:pb-2">

            <div class="w-2/3 text-left">
                <p class="text-base lg:text-lg font-bold line-clamp-2"> {{currentPlaylist.snippet.title}} </p>
                <p class="text-sm lg:text-base">Found {{foundCount}} of {{absentVideos.length}} hidden</p>
            </div>

            <!-- Filter Menu -->
            <div class="flex w-1/3 justify-end">
                <div class="relative inline-block text-left">
                    <div >
                        <button type="button" @click="toggleMenu()" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-magenta-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                        {{ viewModes[activeViewMode] }}
                        <!-- Heroicon name: solid/chevron-down -->
                        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        </button>

                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <div v-if="menuMode" v-click-outside="closeMenu" ref="dropdown" class="origin-top-right absolute right-0 mt-2 w-28 lg:w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                                <div v-for="(viewMode, index) in viewModes" :key="index" class="py-1">
                                    <button @click="activeViewMode = index; menuMode = false" class="w-full text-gray-700 block px-4 py-2 text-left text-sm hover:bg-gray-300">
                                        {{ viewMode }}
                                    </button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

        </div>
        <!-- <div class="flex flex-row flex-wrap place-content-around"> -->
        <div class="grid gap-5 grid-cols-1 py-3 md:gap-8 md:py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <VideoDetails v-for="absentVideo in absentVideos" :vidDetail="vidDetails[absentVideo.vidId]" :activeViewMode="activeViewMode" :searchMode="searchMode" :playlistPos="absentVideo.pos" :key="absentVideo.pos + absentVideo.vidId"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchBar from "@/components/SearchBar.vue"
import VideoDetails from "@/components/VideoDetails.vue"
import vClickOutside from '../v-click-outside'
import localforage from 'localforage'

interface absentVideo {
    pos?: number,
    vidId: string
}

export default defineComponent({
    name: 'Search',
    components: { SearchBar, VideoDetails },
    directives: {
        clickOutside: vClickOutside,
    },
    props: {
        url : String
    },
    data () {
        return {
            vidDetails : new Object as Video,
            currentPlaylist : new Object as Playlist,
            searchUrl : '',
            activeViewMode : 0,
            // 0 - All
            // 1 - Found Videos
            // 2 - Not Found Videos
            viewModes: ['All','Found','Dig More..'],
            absentVideos : new Array<absentVideo>(),
            foundCount : 0,
            searchMode: '',
            menuMode: false,
            searchStatus: 0,
            // 0 Reset
            // 102 Running / Loading
            // 200 Playlists Fetched
            // 206 Partial Content - No Removed Video Found
            // 204 NoContent - Empty Playlist
            // 404 Playlist not found
            // 500 Internal Server Error = Server Error - YT API Cloudflare (TODO: Elaborate errors)

            ytPrefix: 'https://www.youtube.com/',
            ytVidPrefix: 'https://www.youtube.com/watch?v=',
            
            // Help : https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine
            waybackPrefix: 'https://web.archive.org/web/',
            waybackOpt: 'id_/', // id_ (original links) or if_ (wayback archive links)
            wbCorsProxy: import.meta.env.VITE_WB_PROXY,
            
            // Playlist
            ytPApi: 'https://youtube.googleapis.com/youtube/v3/playlists?',
            ytPApiPart: 'part=snippet%2CcontentDetails%2Cstatus',
            ytPApiId: '&id=',

            // Playlist Items
            ytPIApi: 'https://youtube.googleapis.com/youtube/v3/playlistItems?',
            ytPIApiPart: 'part=contentDetails%2C%20status%2C%20id%2C%20snippet',
            ytPIApiMax: '&maxResults=50', // 0 - 50
            ytPIApiId:'&playlistId=',
            ytPIApiPg: '&pageToken=',
            ytApiKey: '&key=',
            ytCorsProxy: 'https://yt.shubhamnh.workers.dev/?',
        }
    },
    created () {
        // From Home / Created first time
        if(this.$route.query.url) {
            // console.log('Created: '+this.$route.query.url)
            this.searchUrl = (this.$route.query?.url)?.toString() || ''
        }
    },
    watch: {
        // Watch URL on Search page
        $route(to) {
            this.searchUrl = (to.query?.url)?.toString() || ''
        }
    },
    methods: {

        async processPlaylist(plId: string) {
            let playlistres, nextPageToken = '', localPlaylist : any, localVideo : any
            let plItems = []
            let url, vidId, status : VideoDetails["status"]
            let playlistList : PlaylistList

            const dbName = this.initializeDb()
            const videodb = this.createVideoInstance(dbName)
            const playlistdb = this.createPlaylistInstance(dbName)

            // Get Playlist Name
            try {
                if (import.meta.env.PROD) { 
                    playlistres =  await fetch(this.ytCorsProxy + this.ytPApi + this.ytPApiPart + this.ytPApiId + plId)
                } else {
                    playlistres =  await fetch(this.ytPApi + this.ytPApiPart + this.ytPApiId + plId + this.ytApiKey + import.meta.env.VITE_YT_API_KEY)
                } 
            } catch (e) {
                console.log(e)
                this.setSearchStatus(500)
                return
            }

            if (playlistres.status !== 200) {
                this.setSearchStatus(500)
                return
            } else {
                playlistList = await playlistres.json()
                if (playlistList.items[0]) {
                    // TODO: Proxy is assigned instead of object
                    this.currentPlaylist = playlistList.items[0]
                } else {
                    this.setSearchStatus(404)
                    return
                }
            }

            try {
                localPlaylist = await playlistdb.getItem(this.currentPlaylist.id)
            } catch (e) {
                console.log(e)
            }

            // Check (etag does not match && has absent playlist items) or localplaylist undefined
            if (((localPlaylist?.playlist.etag !== this.currentPlaylist.etag) && localPlaylist?.absentPlaylistItems) || !localPlaylist) {

                // Get all playlist items
                do {
                    let { playlistItems, nPageToken } = await this.getPlPageItems(plId, nextPageToken)
                    if (playlistItems === undefined) {
                        return
                    }
                    plItems.push(...playlistItems)
                    nextPageToken = nPageToken
                } while (nextPageToken)

                try {
                    await playlistdb.setItem(this.currentPlaylist.id, { 'playlist' : playlistList.items[0], 'absentPlaylistItems' : plItems })
                } catch (e) {
                    console.log(e)
                }
            } else {
                plItems = localPlaylist?.absentPlaylistItems
                // console.log(plItems)
            }

            this.setSearchStatus(200)

            if (plItems.length) {

                // get deleted/private videos
                for (const playlistItem of plItems) {
                    vidId = playlistItem.contentDetails.videoId

                    // Skip Public and Unlisted Videos
                    if (playlistItem.status.privacyStatus === 'public' || playlistItem.status.privacyStatus === 'unlisted') {
                        continue
                    }

                    // Consider 'private' and 'privacyStatusUnspecified' (deleted) videos
                    // Create sequential empty video details
                    url = this.ytVidPrefix + vidId
                    status = playlistItem.status.privacyStatus === 'private' ? 'Private' : 'Deleted'
                    this.addToVidDetails(vidId, this.VideoDetails(vidId, 0, url, status))
                    this.absentVideos.push( {
                        pos:(playlistItem.snippet.position + 1), 
                        vidId: vidId 
                        } as absentVideo )
                }

                // console.log(this.absentVideos)

                if (this.absentVideos.length) {
                    let i = 0, absentVideoBatch : string[]= []

                    // Get and process Snapshots of Videos
                    for (const [index, absentVideo] of this.absentVideos.entries()) {
                        
                        try {
                            localVideo = await videodb.getItem(absentVideo.vidId)
                        } catch (e) {
                            console.log(e)
                        }

                        if (localVideo) {
                            Object.assign( this.vidDetails[absentVideo.vidId], localVideo)
                            if (localVideo.searchStatus === 200)
                                this.foundCount++
                            i++
                        } else if (i < 3 && (index !== (this.absentVideos.length-1))) {
                            absentVideoBatch.push(absentVideo.vidId)
                            i++
                        } else {
                            absentVideoBatch.push(absentVideo.vidId)
                            this.processBatchVideos(videodb, absentVideoBatch)
                            absentVideoBatch = []
                            i = 0
                        }
                    }
                } else {
                    this.setSearchStatus(204)
                }

            } else {
                this.setSearchStatus(206)
            }
        },

        async getPlPageItems (plId: string, nextPageToken ?: string) {
            let res
            const nextPageUrl = this.ytPIApi + this.ytPIApiPart + this.ytPIApiMax + this.ytPIApiId + plId + this.ytPIApiPg + nextPageToken

            if (import.meta.env.PROD) {
                res = await fetch(this.ytCorsProxy + nextPageUrl)
            } else {
                res = await fetch(nextPageUrl + this.ytApiKey + import.meta.env.VITE_YT_API_KEY)
            }

            if (res.status !== 200) {
                if (res.status === 404) {
                    this.setSearchStatus(404)
                }
                else {
                    this.setSearchStatus(500)
                }
                return { undefined }
            }
            
            const resjson = await res.json()
            const playlistItems : PlaylistItem[] = resjson.items
            const nPageToken = resjson.nextPageToken

            return { playlistItems, nPageToken }
        },

        async processVideo (vidId: string) {
            const vidUrl = this.ytVidPrefix + vidId
            const dbName = this.initializeDb()
            const videodb = this.createVideoInstance(dbName)

            this.setSearchStatus(200)
            this.absentVideos.push( {vidId: vidId} as absentVideo )
            this.addToVidDetails(vidId, this.VideoDetails(vidId, 0, vidUrl))

            let localVideo = await videodb.getItem(vidId)
            if (localVideo) {
                Object.assign( this.vidDetails[vidId], localVideo)
            } else {
                this.processBatchVideos(videodb, [vidId])
            }
        },

        async processBatchVideos (videodb: LocalForage, absentVideoBatch : string[]) {
            const res = await fetch(this.wbCorsProxy + 'v=' + absentVideoBatch.join('&v='))
            if (res.status === 200) {
                this.assignToVidDetails(videodb, await res.json())
            } else {
                // TODO: Stop processing video - custom error code
                console.log(res.status + ':' + res.statusText)
            }
        },

        VideoDetails: (
            id: string,
            searchStatus : VideoDetails["searchStatus"],
            url : string,
            status?: VideoDetails["status"],
            workerVersion?: number,
            title?: string,
            snapshotTime?: string,
            channelName?: string,
            channelUrl?: string,
            description?: string,
            published?: string,
            waybackUrl?: string,
            duration?: string) : VideoDetails => {
            return {
                id : id,
                searchStatus : searchStatus,
                workerVersion : workerVersion,
                url : url,
                title: title,
                channelName: channelName,
                channelUrl: channelUrl,
                description: description,
                published: published,
                duration: duration,
                status: status,
                waybackUrl: waybackUrl,
                snapshotTime: snapshotTime
            } as VideoDetails
        },

        resetSearchResults() {
            this.vidDetails = {}
            this.currentPlaylist = new Object as Playlist
            this.absentVideos = []
            this.foundCount = 0
            this.activeViewMode = 0
        },
        initializeDb () : string {
            localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE])
            return 'quiteaplaylist'
        },
        createVideoInstance ( dbName : string ) : LocalForage {
            return localforage.createInstance({
                name        : dbName,
                storeName   : 'Videos',
            });
        },
        createPlaylistInstance ( dbName : string ) : LocalForage {
            return localforage.createInstance({
                name        : dbName,
                storeName   : 'Playlists',
            });
        },
        addToVidDetails (vidId: string, vidDetail: VideoDetails) {
            this.vidDetails[vidId] = vidDetail
        },
        assignToVidDetails (videodb: LocalForage, resData: any) {
            // console.log(resData)
            resData.forEach((res: VideoDetails) => {
                Object.assign( this.vidDetails[res.id], res)
                // If found OR (Not Found && number of snapshots is 0/1)
                if (res.searchStatus === 200 || ((res.searchStatus === 206 || res.searchStatus === 404) && (res.snapshots && res.snapshots < 2))) {
                    try {
                        videodb.setItem(res.id , res)
                    } catch (e) {
                        console.log(e)
                    }
                    if (res.searchStatus === 200)
                        this.foundCount++
                }
            });
        },
        setSearchStatus (status : number) {
            this.searchStatus = status
        },
        setMode (mode : '' | 'video' | 'playlist') {
            this.searchMode = mode
        },
        toggleMenu () {
            this.menuMode = !this.menuMode
        },
        closeMenu () {
            this.menuMode = false
        }
        // vidDetail(vidId: string) {
            // return this.vidDetails[vidId]
        // }
    },
})
</script>
