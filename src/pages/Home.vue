<template>
    <div class="flex flex-col min-h-screen bg-blue-gray-050">
        <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center bg-blue-gray-050 text-gray-800">
            <transition name="fade">
                <div v-if="!searchTriggered" class="flex flex-col place-content-center pt-20">
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
                @setSearchTriggered="setSearchTriggered($event)"
                @setSearchLoading="setSearchLoading($event)"
                @setNotFound="setNotFound($event)"
                @setPlaylistError="setPlaylistError($event)"
                @setNoRemovedVideoFound="setNoRemovedVideoFound($event)"
            />

                <div v-if="searchLoading" class="flex flex-col flex-grow items-center justify-center">
                    <div class="multi-ripple h-28 w-28">
                        <div></div>
                        <div></div>
                    </div>
                </div>

                <div v-if="noRemovedVideosFound" class="flex flex-col flex-grow items-center justify-center">
                    <p>Looks like you're having a lucky day!<br>All your playlist videos are visible!</p>
                </div>

                <div v-if="notFound" class="flex flex-col flex-grow items-center justify-center">
                    <p>Could not find the Playlist mentioned.<br>Make sure the playlist is public or unlisted and try again!</p>
                </div>

                <div v-if="playlistError" class="flex flex-col flex-grow items-center justify-center">
                    <p>Error getting playlist details :(<br>Bug me on Twitter!</p>
                </div>

                <!-- check connection
                server errors - 404, etc -->

            <!-- <div class="flex flex-row flex-wrap place-content-around"> -->
            <div class="grid gap-5 grid-cols-1 md:gap-8 md:py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                <VideoDetails v-for="vidDetail in vidDetails" :vidDetail="vidDetail" :key="vidDetail.id"/>
            </div>
        </div>
        <!-- <div>
            <div class="text-center">Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">flaticon.com</a></div>
        </div> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Search from "@/components/Search.vue";
import VideoDetails from "@/components/VideoDetails.vue";

export default defineComponent({
    name: 'Home',
    components: { Search, VideoDetails },
    data () {
        return {
            vidDetails : new Array<VideoDetails>(),
            noRemovedVideosFound: false,
            searchTriggered: false,
            searchLoading: false,
            notFound: false,
            playlistError: false
        }
    },
    methods: {
        resetVidDetails () {
            this.vidDetails = new Array<VideoDetails>()
        },
        addToVidDetails (vidDetail: VideoDetails) {
            this.vidDetails.push(vidDetail)
        },
        assignToVidDetails ({index, vidData} : {index:number, vidData:any}) {
            Object.assign( this.vidDetails[index] , vidData)
        },
        // setError (error : string) {
        //     this.errorMsg = error
        // },
        setSearchTriggered (val : boolean) {
            this.searchTriggered = val
        },
        setSearchLoading (val : boolean ) {
            this.searchLoading = val
        },
        setNoRemovedVideoFound(val : boolean) {
            this.noRemovedVideosFound = val
        },
        setNotFound (val: boolean) {
            this.notFound = val
        },
        setPlaylistError (val: boolean) {
            this.playlistError = val
        }
    }
})
</script>