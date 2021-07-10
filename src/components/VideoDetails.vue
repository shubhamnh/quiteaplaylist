<template>
    <div id="vidDetail" class="rounded-lg p-5 h-48 w-full bg-white shadow-lg border-gray-400">
        <div v-if="vidDetail.fetchStatus">
            <div v-if="vidDetail.resultStatus">
                <div class="flex flex-row flex-wrap">
                    <h2 class="text-gray-800 font-bold">{{ vidDetail.title }}</h2>
                    <p class="ml-auto">
                        <a :href="this.vidDetail.waybackUrl" target="_blank">
                            {{vidDetail.snapshotTime}}
                        </a>
                    </p>
                </div>
                
                <div class="flex flex-row flex-wrap">
                    <a href="this.vidDetail.channelUrl">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
                        </svg>
                    </a>
                    <a class="text-gray-600 font-normal" href="this.vidDetail.channelUrl">
                        <span> {{ vidDetail.channelName }} </span>
                    </a>
                </div>

                <p v-html="vidDetail.published"></p>
                <p class="line-clamp-2" v-html="vidDetail.description"></p>
                <div class="flex flex-row flex-nowrap">
                    <p>Search:</p>
                    <a :href="ytTitleSearch" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                        </svg>
                    </a>
                    <!-- <a :href="googleUrlSearch" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                        </svg>
                    </a> -->
                </div>
            </div>
            <div v-else class="justify-self-center">
                <h2>Oops! Wasn't able to find any details for this video.</h2>
                <h3>Try searching on:</h3>
                <a :href="googleUrlSearch" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                    </svg>
                </a>
            </div>
        </div>
        <div v-else>
            <h3 class="font-extrabold text-gray-800">Loading...</h3>
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