<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center">
        <SearchBar ref="search" class="flex flex-col"
            @processPlaylist="processPlaylist($event)"
            @processVideo="processVideo($event)"
            :parentInputUrl="queryUrl"
        />

        <div v-if="searchStatus === 102" class="flex flex-col flex-grow items-center justify-center">
            <Loading class="h-28 w-28"/>
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Getting playlist details..</p>
            </div>
        </div>
        
        <div v-else-if="searchStatus === 200" class="flex flex-col flex-grow">

            <!-- If Playlist is Searched-->
            <div v-if="currentPlaylist.snippet" class="flex flex-row flex-wrap items-end pt-4 pb-2">

                <div class="flex flex-row items-center w-full justify-between pb-5 sm:pb-0 sm:justify-start sm:w-2/3 ">
                    <div class="text-left mr-7">
                        <p class="text-base lg:text-lg font-bold line-clamp-2"><a class="hover:underline" :href="`https://www.youtube.com/playlist?list=`+currentPlaylist.id" target="_blank"> {{currentPlaylist.snippet.title}} </a></p>
                        <p class="text-sm">{{currentPlaylist.contentDetails.itemCount}} videos</p>
                        <p class="text-sm"> Found {{foundCount}} of {{absentVideos.length}} hidden</p>
                    </div>
                    <div class="">
                        <button class="rounded-full p-1.5 border hover:bg-gray-100 dark:hover:bg-gray-800 w-9" @click="processPlaylist(currentPlaylist.id, true)" title="Refresh Playlist">
                            <icon name="refresh" alt="Refresh Playlist"/>
                        </button>
                    </div>
                </div>

                <!-- Filter Menu -->
                <div class="flex w-full sm:w-1/3 justify-end">
                    <div class="relative inline-block text-left">
                        <div>
                            <button type="button" @click="toggleMenu()" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-magenta-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            {{ viewModes[activeViewMode] }}
                                <icon class="-mr-1 ml-2 h-5 w-5" name="chevron-down" alt="Dropdown Icon"/>
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

            <!-- <div class="flex flex-row">
                <p>Login to Twitter for better results when searching for missing.</p>
            </div> -->

            <div v-if="currentPlaylist?.contentDetails?.itemCount === 0" class="flex flex-col flex-grow items-center justify-center">
                <span class="text-7xl my-8">🤔</span>
                <p>Looks like your playlist is empty!<br/>Coudn't find any videos in there!</p>
            </div>
            <div v-else-if="!absentVideos.length" class="flex flex-col flex-grow items-center justify-center">
                <span class="text-7xl my-8">🥳</span>
                <p>Looks like you're having a lucky day!<br/>All your playlist videos are visible!</p>
            </div>
            <!-- Video Details -->
            <div v-else class="grid gap-5 grid-cols-1 py-3 md:gap-8 md:py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 dark:text-gray-300">
                <SearchResult v-for="absentVideo in absentVideos" :vidDetail="videos[absentVideo.videoId]" :activeViewMode="activeViewMode" :playlistPos="absentVideo.pos" :key="absentVideo.pos + absentVideo.videoId"/>
            </div>

        </div>

        <div v-else-if="searchStatus === 404" class="flex flex-col flex-grow items-center justify-center">
            <span class="text-7xl my-8">🧐</span>
            <p>Could not find the Playlist mentioned.<br/>Make sure the playlist is Public or Unlisted and try again!</p>
        </div>
        <div v-else class="flex flex-col flex-grow items-center justify-center">
            <span class="text-7xl my-8">☠️</span>
            <p>Could not get playlist details :(<br/> Reach out to me on <a href="https://twitter.com/shubham_nh">Twitter</a> if this persists!</p>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Loading from "@/components/Loading.vue";
import SearchBar from "@/components/SearchBar.vue"
import SearchResult from "@/components/SearchResult.vue"
import { fetchPlaylist, fetchPlaylistItems } from '../composables/usePlaylist'
import vClickOutside from '../helpers/v-click-outside'
import { videoInstance, playlistInstance } from '../helpers/db'

export default defineComponent({
    name: 'Search',
    components: { SearchBar, SearchResult, Loading },
    directives: {
        clickOutside: vClickOutside,
    },
    props: {
        url : String
    },
    async setup(props) {
        const videoDb = await videoInstance()
        const playlistDb = await playlistInstance()

        return {
            videoDb,
            playlistDb,
            fetchPlaylist,
            fetchPlaylistItems
        }
    },
    data () {
        return {
            videos : new Object as Video,
            currentPlaylist : new Object as Playlist,
            absentVideos : new Array<AbsentVideo>(),
            latestWorkerVersion: 111,

            // To pass to SearchBar.vue
            queryUrl : '',
            
            videosPerRequest : 10,
            reqPerSlot : 7,
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
            ytChannelPrefix: 'https://www.youtube.com/channel/',
            ytVidPrefix: 'https://www.youtube.com/watch?v=',
            
            wbCorsProxy: import.meta.env.VITE_WB_PROXY,
        }
    },

    /** When newly created (From Home / Directly opening search url) check query param & pass to SearchBar */
    created () {
        if(this.$route.query.url) {
            this.queryUrl = (this.$route.query?.url)?.toString() || ''
        }
    },

    methods: {

        async processPlaylist(playlistId: string, refreshPlaylist = false ) {
            const updatePlaylist = refreshPlaylist || this.$route.query?.refreshPlaylist
            let localPlaylist : any, localVideo : any, playlistItems : PlaylistItem[] | void = []
            let url, videoId, status : VideoDetails["status"]
            let playlist : Playlist | void
            let playlistUpdated : boolean = false

            this.resetSearchResults()
            this.setSearchStatus(102)

            playlist = await this.fetchPlaylist(playlistId)
                .then( (res : Playlist) => {
                    if (res) {
                        return res
                    } else {
                        this.setSearchStatus(404)
                        return
                    }
                }).catch((err: Error) => {
                    this.setSearchStatus(500)
                    console.log(err.message)
                    return
                })

            if (playlist === undefined) {
                return
            } else {
                this.currentPlaylist = playlist
            }

            // Check if playlist stored in IndexedDb
            try {
                localPlaylist = await this.playlistDb.getItem(this.currentPlaylist.id)
            } catch (e:any) {
                console.log(e.message)
            }

            // Get Playlist items if playlist is updated/undefined else get playlist items from localPlaylist
            // (etag does not match && has playlistItems) or (localplaylist undefined OR playlistItems undefined OR playlist undefined) or (updatePlaylist)
            if (updatePlaylist ||
                ((localPlaylist?.playlist.etag !== this.currentPlaylist.etag) && localPlaylist?.playlistItems) || 
                 (!localPlaylist || !localPlaylist?.playlist || !localPlaylist?.playlistItems)) {

                // Get all playlist items and put in playlistItems[]
                playlistItems = await this.fetchPlaylistItems(playlistId).catch((err : Error) => {
                        this.setSearchStatus(500)
                        console.log(err.message)
                        return
                    }
                )
                playlistUpdated = true
                
            } else {
                playlistItems = localPlaylist?.playlistItems
            }

            this.setSearchStatus(200)

            // TODO : Store Fetched Playlist Items in OriginalVideos db - prevent loss of video info incase video gets removed later on
            if (playlistItems && playlistItems.length) {
                
                // Get deleted/private videos 
                for (const playlistItem of playlistItems) {
                    videoId = playlistItem.contentDetails.videoId

                    // Skip Public and Unlisted Videos
                    if (playlistItem.status.privacyStatus === 'public' || playlistItem.status.privacyStatus === 'unlisted') {
                        continue
                    }

                    // Consider 'private' and 'privacyStatusUnspecified' (deleted) videos
                    // Create sequential empty video details
                    url = this.ytVidPrefix + videoId
                    status = playlistItem.status.privacyStatus === 'private' ? 'Private' : 'Deleted'

                    // Initialize Result Videos and Push to absentVideos[]
                    this.addToVidDetails(videoId, {id: videoId, searchStatus: 0, url: url, status: status} as VideoDetails )

                    this.absentVideos.push( {
                            pos:(playlistItem.snippet.position + 1), 
                            videoId: videoId
                        } as AbsentVideo )
                }

                if (this.absentVideos.length) {
                    let videoBatchToProcess : string[] = []

                    /** Check if video present locally, if not add to Array of videos to be processed */
                    await Promise.all(this.absentVideos.map(async (absentVideo) => {

                        localVideo = await this.videoDb.getItem(absentVideo.videoId).catch(err => {
                            console.log(err.message)
                        })

                        if (localVideo && localVideo.workerVersion >= this.latestWorkerVersion) {
                            this.assignToVidDetails(localVideo)
                        } else {
                            videoBatchToProcess.push(absentVideo.videoId)
                        }
                    }))
                    
                    if (playlistUpdated && localPlaylist?.playlistItems) {

                        let localVideoCopyFound : number[] = []

                        videoBatchToProcess.forEach((videoId, index) => {

                            for(const localPlaylistItem of localPlaylist.playlistItems) {

                                if(localPlaylistItem.contentDetails.videoId === videoId && (localPlaylistItem.status.privacyStatus === 'public' || localPlaylistItem.status.privacyStatus === 'unlisted')) {

                                    this.assignToVidDetails({
                                        id: videoId,
                                        workerVersion : 999,
                                        searchStatus: 200,
                                        source: 'yt',
                                        url: this.ytVidPrefix + videoId,
                                        title: localPlaylistItem.snippet.title,
                                        channelName: localPlaylistItem.snippet.videoOwnerChannelTitle,
                                        channelUrl: this.ytChannelPrefix + localPlaylistItem.snippet.videoOwnerChannelId,
                                        description: localPlaylistItem.snippet.description,
                                        published: localPlaylistItem.contentDetails.videoPublishedAt.substring(0,10)
                                    }, true)
                                    
                                    localVideoCopyFound.push(index)
                                    break
                                }
                            }
                        })

                        localVideoCopyFound.forEach(index => {
                            videoBatchToProcess.splice(index,1)
                        })
                    }

                    for (let i = 0, slot = 1, step = 0; i < videoBatchToProcess.length ; i=i+this.videosPerRequest) {
                        
                        if ( i > this.videosPerRequest*this.reqPerSlot) {
                            if ( i > this.videosPerRequest*this.reqPerSlot*slot) {
                                slot++
                                step = step + this.slotStepIncrease
                            }
                            setTimeout(this.processBatchVideos, (this.slotDelaySeconds*1000*slot)+(step*1000), videoBatchToProcess.slice(i,i+this.videosPerRequest))
                        } else {
                            this.processBatchVideos(videoBatchToProcess.slice(i,i+this.videosPerRequest))
                        }
                    }
                }

                if (playlistUpdated) {
                    await this.playlistDb.setItem(this.currentPlaylist.id, { 'playlist' : playlist, 'playlistItems' : playlistItems })
                }
            }
        },

        async processVideo (videoId: string) {
            const vidUrl = this.ytVidPrefix + videoId
            this.resetSearchResults()

            this.setSearchStatus(200)
            this.absentVideos.push( {videoId: videoId} as AbsentVideo )
            this.addToVidDetails(videoId, {id: videoId, searchStatus: 0, url: vidUrl} as VideoDetails)

            let localVideo = await this.videoDb.getItem(videoId)
            if (localVideo) {
                Object.assign( this.videos[videoId], localVideo)
            } else {
                this.processBatchVideos([videoId])
            }
        },

        async processBatchVideos (videoBatchToProcess : string[]) {
            await fetch(this.wbCorsProxy + 'v=' + videoBatchToProcess.join('&v='))
                .then(async res => {
                    if (res.status === 200) {
                        const resData = await res.json()
                        resData.forEach((res : VideoDetails) => {
                            this.assignToVidDetails(res, true)   
                        });
                    } else {
                        videoBatchToProcess.forEach(videoId => {
                            const url = this.ytVidPrefix + videoId
                            this.assignToVidDetails({ id: videoId, workerVersion: 0, searchStatus: 500, source: 'worker', title: 'Something went wrong. Status: ' + res.status, url: url})
                        });
                    }
                }).catch( err => {
                        console.log(err)
                        videoBatchToProcess.forEach(videoId => {
                            const url = this.ytVidPrefix + videoId
                            this.assignToVidDetails({ id: videoId, workerVersion: 0, searchStatus: 500, source: 'worker', title: 'Too many requests. Try refreshing again?', url: url})
                        });
                    }
                );
        },

        resetSearchResults() {
            this.videos = {}
            this.currentPlaylist = new Object as Playlist
            this.absentVideos = []
            this.foundCount = 0
            this.activeViewMode = 0
        },

        addToVidDetails (videoId: string, vidDetail: VideoDetails) {
            this.videos[videoId] = vidDetail
        },
        async assignToVidDetails (vidDetail: VideoDetails, storeLocally = false) {
            // console.log(resData)
            Object.assign( this.videos[vidDetail.id], vidDetail)

            if (vidDetail.searchStatus === 200)
                this.foundCount++
            
            // If true, save in db
            if (storeLocally) {
                // If found OR (Not Found && (number of snapshots is defined && is 0/1) OR (Not Found in cdx)
                if (vidDetail.searchStatus === 200 || ((vidDetail.searchStatus === 206 || vidDetail.searchStatus === 404) && (vidDetail.snapshots && vidDetail.snapshots < 2)) || (vidDetail.searchStatus === 404 && vidDetail.source === 'cdx')) {

                    try {
                        this.videoDb.setItem(vidDetail.id , vidDetail)
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
