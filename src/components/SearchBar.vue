<template>
    <div>
        <div class="flex flex-row place-content-center my-4">
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

        <div>
            <h2> {{ searchError }} </h2>
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

            const vidRegex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?v=([^&\s]+).*)|(?:v\/(.*))))?)|(?:youtu\.be\/(.*)?))/i
            const plRegex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:playlist\?.*?list=([^&\s]+).*)))?)|(?:youtu\.be\/(.*)?))/i
            const vidIdMatch = inputUrl.match(vidRegex)
            const plIdMatch = inputUrl.match(plRegex)
            let vidId, plId
            this.setSearchError('')


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
                const routeName = this.$route.name
                this.$emit('setSearchStatus', 102)

                // Home
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

                    // Reset Video details and process
                    this.$emit('resetVidDetails')
                    if (plId) {
                        this.$emit('setMode', 'playlist')
                        this.$emit('processPlaylist', plId)
                    } else {
                        this.$emit('setMode', 'video')
                        this.$emit('processVideo', vidId)
                    }
                }

            }
             else {
                this.setSearchError('Could not detect Video or Playlist URL')

            }
        },

        setSearchError (error: string) {
            this.searchError = error
        }
    },

    data () {
        return {
            inputUrl: '',
            searchError: '',  
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