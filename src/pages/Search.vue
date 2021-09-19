<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center bg-gray-50">
        <SearchBar ref="search" class="flex flex-col"
            @processPlaylist="processPlaylist($event)"
            @processVideo="processVideo($event)"
            @resetSearchResults="resetSearchResults()"
            @setSearchStatus="setSearchStatus($event)"
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
            <p>Looks like you're having a lucky day!<br/>All your playlist videos are visible!</p>
        </div>
        <div v-else-if="searchStatus === 206" class="flex flex-col flex-grow items-center justify-center">
            <p>Looks like your playlist is empty!<br/>Coudn't find any videos in there!</p>
        </div>
        <div v-else-if="searchStatus === 404" class="flex flex-col flex-grow items-center justify-center">
            <p>Could not find the Playlist mentioned.<br/>Make sure the playlist is public or unlisted and try again!</p>
        </div>
        <div v-else-if="searchStatus === 500" class="flex flex-col flex-grow items-center justify-center">
            <p>Error getting playlist details :(<br/> Reach out to me on <a href="https://twitter.com/shubham_nh">Twitter</a> if this persists!</p>
        </div>

        <!-- If Playlist is Searched-->
        <div v-if="searchStatus === 200 && currentPlaylist.snippet" class="flex flex-row items-end pt-4 pb-3 lg:pb-2">

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

        <!-- Video Details -->
        <div class="grid gap-5 grid-cols-1 py-3 md:gap-8 md:py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <SearchResult v-for="absentVideo in absentVideos" :vidDetail="vidDetails[absentVideo.vidId]" :activeViewMode="activeViewMode" :playlistPos="absentVideo.pos" :key="absentVideo.pos + absentVideo.vidId"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchBar from "@/components/SearchBar.vue"
import SearchResult from "@/components/SearchResult.vue"
import vClickOutside from '../helpers/v-click-outside'
import localforage from 'localforage'

export default defineComponent({
    name: 'Search',
    components: { SearchBar, SearchResult },
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
            absentVideos : new Array<absentVideo>(),

            // To pass to SearchBar.vue
            searchUrl : '',
            
            videosPerRequest : 5,
            reqPerSlot : 10,
            slotDelaySeconds : 5,
            slotStepIncrease : 3,
            
            // 0 - All
            // 1 - Found Videos
            // 2 - Not Found Videos
            activeViewMode : 0,
            viewModes: ['All','Found','Dig More..'],

            foundCount : 0,
            menuMode: false,

            // 0 Reset
            // 102 Running / Loading
            // 200 Playlists Fetched
            // 206 Partial Content - No Removed Video Found
            // 204 NoContent - Empty Playlist
            // 404 Playlist not found
            // 500 Internal Server Error = Server Error - YT API Cloudflare (TODO: Elaborate errors)
            searchStatus: 0,

            ytPrefix: 'https://www.youtube.com/',
            ytVidPrefix: 'https://www.youtube.com/watch?v=',
            
            // Help : https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine
            waybackPrefix: 'https://web.archive.org/web/',
            waybackOpt: 'id_/', // id_ (original links) or if_ (wayback archive links)
            wbCorsProxy: import.meta.env.VITE_WB_PROXY,
            
            // Playlist
            ytPlaylistApi: 'https://youtube.googleapis.com/youtube/v3/playlists?',
            ytPlaylistApiPart: 'part=snippet%2CcontentDetails%2Cstatus',
            ytPlaylistApiId: '&id=',

            // Playlist Items
            ytPlaylistItemsApi: 'https://youtube.googleapis.com/youtube/v3/playlistItems?',
            ytPlaylistItemsApiPart: 'part=contentDetails%2C%20status%2C%20id%2C%20snippet',
            ytPlaylistItemsApiMax: '&maxResults=50', // 0 - 50
            ytPlaylistItemsApiId:'&playlistId=',
            ytPlaylistItemsApiPg: '&pageToken=',
            ytApiKey: '&key=',
            ytCorsProxy: 'https://yt.shubhamnh.workers.dev/?',
        }
    },

    /** When newly created (From Home / Directly opening search url) check query param & pass to SearchBar */
    created () {
        if(this.$route.query.url) {
            this.searchUrl = (this.$route.query?.url)?.toString() || ''
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
                    playlistres =  await fetch(this.ytCorsProxy + this.ytPlaylistApi + this.ytPlaylistApiPart + this.ytPlaylistApiId + plId)
                } else {
                    playlistres =  await fetch(this.ytPlaylistApi + this.ytPlaylistApiPart + this.ytPlaylistApiId + plId + this.ytApiKey + import.meta.env.VITE_YT_API_KEY)
                } 
            } catch (e) {
                console.log(e)
                this.setSearchStatus(500)
                return
            }

            // Set currentPlaylist
            if (playlistres.status !== 200) {
                this.setSearchStatus(500)
                return
            } else {
                playlistList = await playlistres.json()
                if (playlistList.items[0]) {
                    // TODO: Proxy is assigned instead of Object
                    this.currentPlaylist = playlistList.items[0]
                } else {
                    this.setSearchStatus(404)
                    return
                }
            }
            
            // Check if playlist stored in IndexedDb
            try {
                localPlaylist = await playlistdb.getItem(this.currentPlaylist.id)
            } catch (e) {
                console.log(e)
            }

            // Get Playlist items if playlist is updated/undefined else get playlist items from localPlaylist
            // (etag does not match && has playlistItems) or (localplaylist undefined OR playlistItems undefined OR playlist undefined)
            if (((localPlaylist?.playlist.etag !== this.currentPlaylist.etag) && localPlaylist?.playlistItems) || (!localPlaylist || !localPlaylist?.playlistItems || !localPlaylist?.playlist)) {

                // Get all playlist items and put in plItems[]
                do {
                    let pageItems = await this.getPlaylistPageItems(plId, nextPageToken)
                    if (pageItems === undefined) {
                        return
                    }

                    let { playlistPageItems, nPageToken } = pageItems
                    plItems.push(...playlistPageItems)
                    nextPageToken = nPageToken
                } while (nextPageToken)

                try {
                    await playlistdb.setItem(this.currentPlaylist.id, { 'playlist' : playlistList.items[0], 'playlistItems' : plItems })
                } catch (e) {
                    console.log(e)
                }
                
            } else {
                plItems = localPlaylist?.playlistItems
            }

            this.setSearchStatus(200)

            // TODO : Store Fetched Playlist Items in OriginalVideos db - prevent loss of video info incase video gets removed later on
            if (plItems.length) {

                // Get deleted/private videos 
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

                    // Initialize Result Videos and Push to absentVideos[]
                    this.addToVidDetails(vidId, {id: vidId, searchStatus: 0, url: url, status: status} as VideoDetails )

                    this.absentVideos.push( {
                        pos:(playlistItem.snippet.position + 1), 
                        vidId: vidId 
                        } as absentVideo )
                }

                if (this.absentVideos.length) {
                    let videoBatchToProcess : string[] = []

                    /** Check if video present locally, if not add to Array of videos to be processed */
                    await Promise.all(this.absentVideos.map(async (absentVideo) => {
                        try {
                            localVideo = await videodb.getItem(absentVideo.vidId)
                        } catch (e) {
                            console.log(e)
                        }

                        if (localVideo) {
                            this.assignToVidDetails(localVideo)
                        } else {
                            videoBatchToProcess.push(absentVideo.vidId)
                        }
                    }))

                    for (let i = 0, slot = 1, step = 0; i < videoBatchToProcess.length ; i=i+this.videosPerRequest) {
                        
                        if ( i > this.videosPerRequest*this.reqPerSlot) {
                            if ( i > this.videosPerRequest*this.reqPerSlot*slot) {
                                slot++
                                step = step + this.slotStepIncrease
                            }
                            setTimeout(this.processBatchVideos, (this.slotDelaySeconds*1000*slot)+(step*1000), videodb, videoBatchToProcess.slice(i,i+this.videosPerRequest))
                        } else {
                            this.processBatchVideos(videodb, videoBatchToProcess.slice(i,i+this.videosPerRequest))
                        }
                    }

                } else {
                    this.setSearchStatus(204)
                }

            } else {
                this.setSearchStatus(206)
            }
        },

        async getPlaylistPageItems (plId: string, nextPageToken ?: string)
             : Promise <{ playlistPageItems: PlaylistItem[]; nPageToken: string; } | undefined > {
            let res
            const nextPageUrl = this.ytPlaylistItemsApi + this.ytPlaylistItemsApiPart + this.ytPlaylistItemsApiMax + this.ytPlaylistItemsApiId + plId + this.ytPlaylistItemsApiPg + nextPageToken

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
                return
            }
            
            const resjson = await res.json()
            const playlistPageItems : PlaylistItem[] = resjson.items
            const nPageToken = resjson.nextPageToken

            return { playlistPageItems, nPageToken }
        },

        async processVideo (vidId: string) {
            const vidUrl = this.ytVidPrefix + vidId
            const dbName = this.initializeDb()
            const videodb = this.createVideoInstance(dbName)

            this.setSearchStatus(200)
            this.absentVideos.push( {vidId: vidId} as absentVideo )
            this.addToVidDetails(vidId, {id: vidId, searchStatus: 0, url: vidUrl} as VideoDetails)

            let localVideo = await videodb.getItem(vidId)
            if (localVideo) {
                Object.assign( this.vidDetails[vidId], localVideo)
            } else {
                this.processBatchVideos(videodb, [vidId])
            }
        },

        async processBatchVideos (videodb: LocalForage, videoBatchToProcess : string[]) {
            await fetch(this.wbCorsProxy + 'v=' + videoBatchToProcess.join('&v='))
                .then(async res => {
                    if (res.status === 200) {
                        const resData = await res.json()
                        resData.forEach((res : VideoDetails) => {
                            this.assignToVidDetails(res, videodb)   
                        });
                    } else {
                        videoBatchToProcess.forEach(vidId => {
                            const url = this.ytVidPrefix + vidId
                            this.assignToVidDetails({ id: vidId, workerVersion: 0, searchStatus: 500, source: 'worker', title: 'Something went wrong. Status: ' + res.status, url: url})
                        });
                    }
                }).catch( err => {
                        console.log(err)
                        videoBatchToProcess.forEach(vidId => {
                            const url = this.ytVidPrefix + vidId
                            this.assignToVidDetails({ id: vidId, workerVersion: 0, searchStatus: 500, source: 'worker', title: 'Too many requests. Try refreshing again?', url: url})
                        });
                    }
                );
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
        async assignToVidDetails (vidDetail: VideoDetails, videodb?: LocalForage) {
            // console.log(resData)
            Object.assign( this.vidDetails[vidDetail.id], vidDetail)

            if (vidDetail.searchStatus === 200)
                this.foundCount++
            
            // If localForage object passed, save in db
            if (videodb) {
                // If found OR (Not Found && (number of snapshots is defined && is 0/1) OR (Not Found in cdx)
                if (vidDetail.searchStatus === 200 || ((vidDetail.searchStatus === 206 || vidDetail.searchStatus === 404) && (vidDetail.snapshots && vidDetail.snapshots < 2)) || (vidDetail.searchStatus === 404 && vidDetail.source === 'cdx')) {

                    try {
                        videodb.setItem(vidDetail.id , vidDetail)
                    } catch (e) {
                        console.log(e)
                    }
                    
                }
            }
        },
        setSearchStatus (status : number) {
            this.searchStatus = status
        },
        toggleMenu () {
            this.menuMode = !this.menuMode
        },
        closeMenu () {
            this.menuMode = false
        }
    },
})
</script>
