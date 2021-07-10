<template>
    <div class="">
        <div class="flex flex-col px-4 md:px-8 py-24 text-center bg-blue-gray-050 text-gray-800">
            <div class="flex flex-col place-content-center">
                <div class="my-5">
                    <p class="text-lg font-extrabold uppercase my-1">Missing Videos from your YouTube playlist treasury?</p>
                    <p class="text-xs font-extrabold my-1.5">It's a crappy feeling :(</p>    
                </div>
                <p class="text-xl font-extrabold uppercase my-4">Let's find them!</p>
            </div>
            <Search
                class="flex flex-row place-content-center my-4"
                @resetVidDetails="resetVidDetails()"
                @addToVidDetails="addToVidDetails($event)"
                @assignToVidDetails="assignToVidDetails($event)"
                @setError="setError($event)"
            />
            <div>
                <h2 v-html="errorMsg"></h2>
            </div>
            <!-- <div class="flex flex-row flex-wrap place-content-around"> -->
            <div class="grid gap-4 grid-cols-1 md:gap-8 md:py-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                <VideoDetails v-for="vidDetail in vidDetails" :vidDetail="vidDetail" :key="vidDetail.id"/>
            </div>
        </div>
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
            errorMsg: ''
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
            console.log(index,vidData)
            Object.assign( this.vidDetails[index] , vidData)
        },
        setError (error : string) {
            this.errorMsg = error
        },
    }
})
</script>