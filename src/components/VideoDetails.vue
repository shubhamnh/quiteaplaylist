<template>
    <div id="vidDetail" class="relative h-auto w-full p-5 rounded-lg bg-white shadow-lg border-2 border-gray-200">

        <span class="absolute flex items-center justify-center -top-2 -left-2 rounded-full w-7 h-7 text-xs bg-blue-gray-100 text-gray-900">
            {{vidDetail.playlistPosition}}
        </span>

        <div v-if="vidDetail.fetchStatus">

            <div v-if="vidDetail.resultStatus">
                <span class="absolute bottom-0 right-0 rounded-tl-lg text-xs p-1.5 bg-gray-200">
                    <a :href="vidDetail.waybackUrl" target="_blank">
                        {{vidDetail.snapshotTime}}
                    </a>
                </span>

                <div class="flex flex-row">
                    <h2 class="line-clamp-1 text-gray-800 font-bold">{{ vidDetail.title }}</h2>
                </div>
                
                <div class="flex flex-row flex-wrap gap-1 text-sm">
                    <div>
                        <a :href="vidDetail.channelUrl">
                            <img src="@/assets/icons/user.svg" alt="User">
                        </a>
                    </div>
                    <div>
                        <a class="" :href="vidDetail.channelUrl" target="_blank">
                            <span class="line-clamp-1"> {{ vidDetail.channelName }} </span>
                        </a>
                    </div>
                </div>

                <p class="text-sm" v-html="vidDetail.published"></p>

                <p class="hidden md:line-clamp-2 my-2" v-html="vidDetail.description"></p>

                <div class="flex flex-row flex-nowrap gap-2">
                    <p>Find similar:</p>
                    <a :href="ytTitleSearch" target="_blank">
                        <img src="@/assets/icons/youtube.svg" alt="YouTube">
                    </a>
                </div>
            </div>

            <div v-else class="flex flex-row flex-nowrap items-stretch text-center">
                <div class="flex flex-col w-3/5 items-center">
                    <!-- <h2 class="text-xl">Oops!</h2> -->
                    <div class=" p-2">
                        <img src="@/assets/gem.png" alt="Gem of a Video!">
                    </div>
                    <!-- <p class="text-xs">Looks like we have a gem in here!<br>Need to do some more digging!</p> -->
                    <p class="text-xs">Need to do some more digging to find this gem!</p>
                </div>
                <div class="flex flex-col w-2/5">
                    <h3>Try searching on:</h3>
                    <div class="flex flex-grow items-stretch p-3">
                        <a class="flex flex-grow items-center justify-center" :href="braveUrlSearch" target="_blank"> 
                                <img class="object-contain" src="@/assets/icons/brave.svg" alt="Brave">
                        </a>
                        <a class="flex flex-grow items-center justify-center" :href="googleUrlSearch" target="_blank">
                                <img class="object-contain" src="@/assets/icons/google.svg" alt="Google">
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex h-full items-center justify-center">
            <h3 class="justify-self center font-extrabold text-gray-800 animate-pulse">Loading...</h3>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'VideoDetails',
    props: {
        vidDetail: {
            type: Object as PropType<VideoDetails>,
            required: true,
        },
    },
    computed: {
        ytTitleSearch (this) {
            return "https://www.youtube.com/results?search_query=" + encodeURIComponent(this.vidDetail.title)
        },
        googleUrlSearch (this) {
            return "https://www.google.com/search?q=" + this.vidDetail.url
        },
        braveUrlSearch (this) {
            return "https://search.brave.com/search?q=" + this.vidDetail.url
        }
    }
})
</script>

<style lang="css">
#vidDetail {
    text-align: left;
}

p {
    white-space: pre-wrap;
}

</style>