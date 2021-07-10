<template>
    <div id="vidDetail" class="rounded-lg p-5 h-48 w-full bg-white shadow-lg border-gray-400">
        <div v-if="vidDetail.fetchStatus">

            <div v-if="vidDetail.resultStatus">
                <div class="flex flex-row gap-4">
                    <h2 class="grow text-gray-800 font-bold">{{ vidDetail.title }}</h2>
                    <p class="ml-auto">
                        <a :href="this.vidDetail.waybackUrl" target="_blank">
                            {{vidDetail.snapshotTime}}
                        </a>
                    </p>
                </div>
                
                <div class="flex flex-row flex-wrap gap-1">
                    <div>
                        <a href="this.vidDetail.channelUrl">
                            <img src="@/assets/icons/user.svg" alt="User">
                        </a>
                    </div>
                    <div>
                        <a class="text-gray-600 font-normal" href="this.vidDetail.channelUrl">
                            <span> {{ vidDetail.channelName }} </span>
                        </a>
                    </div>
                </div>

                <p v-html="vidDetail.published"></p>
                <p class="line-clamp-2" v-html="vidDetail.description"></p>
                <div class="flex flex-row flex-nowrap gap-2">
                    <p>Search:</p>
                    <a :href="ytTitleSearch" target="_blank">
                        <img src="@/assets/icons/youtube.svg" alt="YouTube">
                    </a>
                </div>
            </div>

            <div v-else class="justify-items-center">
                <h2>Oops! Your playlist seems to be having some gems!<br>Will have to do some more digging!</h2>
                <h3>Try searching on:</h3>
                <div class="flex flex-row gap-2 items-center">
                    <div>
                        <a :href="braveUrlSearch" target="_blank">
                            <img src="@/assets/icons/brave.svg" alt="Brave">
                        </a>
                    </div>
                    <div>
                        <a :href="googleUrlSearch" target="_blank">
                            <img src="@/assets/icons/google.svg" alt="Google">
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <h3 class="justify-self center font-extrabold text-gray-800">Loading...</h3>
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