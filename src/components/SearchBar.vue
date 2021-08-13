<template>
    <div>
        <div class="flex flex-col place-content-center my-2">
            <div class="flex flex-row place-content-center">
                <div class="flex flex-row flex-grow items-center justify-between rounded-full bg-white border border-gray-300 focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200
                    text-base text-gray-700 mx-2 leading-8 transition-colors duration-200 ease-in-out max-w-lg">
                    <input class="outline-none w-full mx-3"
                        @keyup.enter="detectUrl(inputUrl)"
                        v-model="inputUrl"
                        type="text"
                        placeholder="YouTube Playlist or Video URL"
                    />
                    <span v-if="inputUrl" class="flex items-center rounded-full p-1 mr-1 bg-white">
                        <button class="rounded-full bg-gray-200 p-1 focus:outline-none focus:shadow-outline" @click="inputUrl = ''" title="Clear Search">
                            <img src="@/assets/icons/x.svg" alt="Clear">
                        </button>
                    </span>
                    <!-- <span class="flex items-center">
                        <button class="p-1 focus:outline-none focus:shadow-outline" @click="pasteClipboard">
                            <img src="@/assets/icons/clipboard.svg" alt="Paste">
                        </button>
                    </span> -->
                </div>
                <button class="rounded-full h-10 w-10 
                    bg-white border border-gray-300 focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200" 
                    @click="detectUrl(inputUrl)" title="Search">
                        <img src="@/assets/icons/arrow-right.svg" alt="Submit">
                </button>
            </div>
            
            <!-- <div v-if="this.$route.name === 'Home'" class="text-center mt-3 mb-5">
                <p class="text-xs text-gray-500">eg: youtube.com/playlist?list=PL3C4524EE01D5994F</p>
            </div> -->
        </div>

        <div v-if="searchError" class="my-2">
            <p class="inline text-sm"> Could not detect Playlist or Video URL. </p>
            <a href="/help" title="Help">
                <svg xmlns="http://www.w3.org/2000/svg" class="inline h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </a>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import router from '../router'

export default defineComponent({
    name: 'SearchBar',
    props: {
        searchUrl : String
    },
    methods: {
        detectUrl(inputUrl : string) {
            const vidRegex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?v=([^&\s]+).*)|(?:v\/(.*))))?)|(?:youtu\.be\/([^&?\s]+)?))/i
            const plRegex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:playlist\?.*?list=([^&\s]+).*)))?)|(?:youtu\.be\/(.*)?))/i
            const vidIdMatch = inputUrl.match(vidRegex)
            const plIdMatch = inputUrl.match(plRegex)
            let vidId, plId
            this.searchError = false

            if (vidIdMatch) {
                if (vidIdMatch[1]) {
                    vidId = vidIdMatch[1]
                } else if (vidIdMatch[2]) {
                    vidId = vidIdMatch[2]
                } else vidId = vidIdMatch[3]
            }

            if (plIdMatch && plIdMatch[1]) {
                plId = plIdMatch[1]
            }

            console.log(vidIdMatch)
            console.log(plIdMatch)
            console.log(vidId, plId)

            if (plId || (vidId && vidId.length === 11)) {
                this.processPlaylistOrVideo(plId, vidId, inputUrl)
            }
             else {
                this.searchError = true
            }
        },

        processPlaylistOrVideo(plId : string | undefined , vidId : string | undefined, inputUrl : string) {
            const routeName = this.$route.name
            this.$emit('setSearchStatus', 102)
            this.$emit('resetSearchResults')

            // If Search on Home Page
            if (routeName === 'Home') {
                this.$router.push({path:'search', query : {url: inputUrl}})

            } else if (routeName === 'Search') {               
                const queryUrl = (this.$route.query?.url)?.toString()

                // New Search on Search page => update path
                if (queryUrl !== inputUrl) {
                    console.log('New Search page')
                    this.$router.push({path:'search', query : {url: inputUrl}})
                    return
                }

                if (plId) {
                    this.$emit('setMode', 'playlist')
                    this.$emit('processPlaylist', plId)
                } else {
                    this.$emit('setMode', 'video')
                    this.$emit('processVideo', vidId)
                }
            }
        },
    },

    data () {
        return {
            inputUrl: '',
            searchError: false,  
        }
    },

    // From Home / First Created
    created () {
        console.log(this.searchUrl)
        if (this.searchUrl) {
            this.inputUrl = this.searchUrl
            this.detectUrl(this.inputUrl)
        }
    },

    // Any change on Search Page Url
    watch: {
        searchUrl(newUrl, oldUrl) {
            console.log(newUrl)
            if (newUrl) {
                this.inputUrl = newUrl
                this.detectUrl(newUrl)
            }
        }
    }

});
</script>