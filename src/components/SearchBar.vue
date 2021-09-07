<template>
    <div class="w-full">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </span>
                </div>
                <button class="rounded-full h-10 w-10 
                    bg-white border border-gray-300 hover: focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200" 
                    @click="detectUrl(inputUrl)" title="Search" alt="Submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                </button>
            </div>
            
        </div>

        <div v-if="searchError" class="flex flex-row justify-center items-center gap-1 my-3">
            <div>
                <p class="inline text-sm"> Could not detect Playlist or Video URL. </p>
            </div>
            <div>
                <router-link to="/find-watch-deleted-private-youtube-video-playlist/#url-accepted" title="Guide">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SearchBar',
    props: {
        searchUrl : String
    },
    data () {
        return {
            inputUrl: '',
            searchError: false,
        }
    },
    
    /**
     * When Search Page is newly rendered it passes searchUrl prop
     * to newly rendered SearchBar Component. If searchUrl is present,
     * process it.
    */
    created () {
        if (this.searchUrl) {
            this.inputUrl = this.searchUrl
            this.detectUrl(this.inputUrl)
        }
    },

    watch: {
        /** Watch for new query submitted on Search Page => route changes
         *  Since new Component isn't created on route change once loaded.
         */
        $route(to) {
            this.inputUrl = (to.query?.url)?.toString() || ''
            if (this.inputUrl)
                this.detectUrl(this.inputUrl)
        },

        /** For inputUrl change in Search Bar */
        inputUrl () {
            this.searchError = false
        }
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

            if (plId || (vidId && vidId.length === 11)) {
                this.processPlaylistOrVideo(plId, vidId, inputUrl)
            }
             else {
                this.searchError = true
            }
        },

        processPlaylistOrVideo(plId : string | undefined , vidId : string | undefined, inputUrl : string) {
            const routeName = this.$route.name
            this.$emit('resetSearchResults')
            this.$emit('setSearchStatus', 102)

            // If Search on Home Page
            if (routeName === 'Home') {
                this.$router.push({path:'search', query : {url: inputUrl}})

            } else if (routeName === 'Search') {               
                const queryUrl = (this.$route.query?.url)?.toString()

                // If New Search on Search page => update path
                if (queryUrl !== inputUrl) {
                    this.$router.push({path:'search', query : {url: inputUrl}})
                    return
                }

                if (plId) {
                    this.$emit('processPlaylist', plId)
                } else {
                    this.$emit('processVideo', vidId)
                }
            }
        },
    },

});
</script>