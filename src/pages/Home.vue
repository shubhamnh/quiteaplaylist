<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center bg-blue-gray-050 text-gray-800">
        <transition name="fade">
            <div v-if="!searchStatus" class="flex flex-col place-content-center pt-20">
                <div class="my-5">
                    <p class="text-lg font-extrabold uppercase my-1">Missing Videos from your YouTube playlist treasury?</p>
                    <p class="text-xs font-extrabold my-1.5">It's a crappy feeling :(</p>
                </div>
                <p class="text-xl font-extrabold uppercase my-4">Let's find them!</p>
            </div>
        </transition>
        <Search class="flex flex-col"
            @resetVidDetails="resetVidDetails()"
            @addToVidDetails="addToVidDetails($event)"
            @assignToVidDetails="assignToVidDetails($event)"
            @setPlaylist="setPlaylist($event)"
            @setSearchStatus="setSearchStatus($event)"
            @setMode="setMode($event)"
        />
        <div v-if="searchStatus === 102" class="flex flex-col flex-grow items-center justify-center">
            <div class="multi-ripple h-28 w-28">
                <div></div>
                <div></div>
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
            <p>Error getting playlist details :(<br>Bug me on Twitter!</p>
        </div>
        <div v-if="searchStatus === 200 && mode === 'playlist'" class="py-2">
            <p class="text-lg"> {{playlistName}} </p>
            <p class="text-sm">Found {{foundCount}} of {{vidDetails.length}} videos</p>
            <button @click="viewMode = 0">
                <span>All</span>
            </button>
            <button @click="viewMode = 1">
                <span>Found</span>
            </button>
            <button @click="viewMode = 2">
                <span>Not Found</span>
            </button>
        </div>
        <!-- <div class="flex flex-row flex-wrap place-content-around"> -->
        <div class="grid gap-5 grid-cols-1 md:gap-8 md:py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <VideoDetails v-for="vidDetail in vidDetails" :vidDetail="vidDetail" :viewMode="viewMode" :mode="mode" :key="vidDetail.id"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import App from '@/App.vue'
import Search from "@/components/Search.vue"
import VideoDetails from "@/components/VideoDetails.vue"

export default defineComponent({
    name: 'Home',
    components: { Search, VideoDetails },
    data () {
        return {
            vidDetails : new Array<VideoDetails>(),
            playlistName : '',
            viewMode : 0,
            foundCount : 0,
            searchStatus: 0,
            mode: ''
            // 0 notTriggered
            // 102 Running / Loading
            // 200 Playlists Fetched
            // 206 Partial Content - No Removed Video Found
            // 204 NoContent - Empty Playlist
            // 404 Playlist not found
            // 500 Internal Server Error = Server Error - YT API Cloudflare (TODO: Elaborate errors)

        }
    },
    methods: {
        resetVidDetails () {
            this.vidDetails = new Array<VideoDetails>()
            this.playlistName = ''
            this.foundCount = 0
            this.viewMode = 0
        },
        addToVidDetails (vidDetail: VideoDetails) {
            this.vidDetails.push(vidDetail)
        },
        assignToVidDetails ({index, vidData} : {index:number, vidData: VideoDetails}) {
            Object.assign( this.vidDetails[index] , vidData)
            if (vidData.searchStatus && vidData.searchStatus === 200)
                this.foundCount++
        },
        setPlaylist (playlist: Playlist) {
            this.playlistName = playlist.snippet.title
        },
        setSearchStatus (status : number) {
            this.searchStatus = status
        },
        setMode (mode : '' | 'video' | 'playlist') {
            this.mode = mode
        }
    },
})
</script>