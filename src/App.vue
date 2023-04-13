<template>
    <div class="flex flex-col min-h-screen bg-white text-blue-gray-900 dark:bg-gray-800 dark:text-gray-50">
        <header class="flex flex-row items-center border-b shadow dark:border-0">
            <div class="flex flex-row flex-grow justify-between items-center mx-5 my-3">
                <router-link to="/" title="Home">
                    <HeaderLogo class="inline w-28 h-auto" alt="quite a playlist"/>
                </router-link>

                <nav>
                    <ul class="flex flex-row gap-2 sm:gap-5">
                        <li class="relative group">
                            <router-link v-slot="{ isActive }" to="/playlists" class="px-2 py-2 font-semibold" title="Playlists">
                                <icon class="inline align-text-top h-5 w-5" name="playlist" alt="Playlist Icon"/>

                                <span class="hidden sm:inline sm:pl-1">Playlists</span>
                                <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                            </router-link>
                        </li>

                        <li class="relative group">
                            <router-link v-slot="{ isActive }" to="/find-watch-deleted-private-youtube-video-playlist" class="px-2 py-2 font-semibold" title="Guide">
                                <icon class="inline align-text-top h-5 w-5" name="book-open" alt="Guide Icon"/>

                                <!-- Guide -->
                                <span class="hidden sm:inline sm:pl-1">Guide</span>
                                <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                            </router-link>
                    
                        </li>

                        <li class="relative group">
                            <router-link v-slot="{ isActive }" to="/about" class="px-2 py-2 font-semibold" title="About">
                                <icon class="inline align-text-top h-5 w-5" name="info-circle" alt="About Icon"/>
                                
                                <span class="hidden sm:inline sm:pl-1">About</span>
                                <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                            </router-link>
                        </li>

                        <li class="relative group">
                            <div role="button" class="inline px-2 py-2 font-semibold hover:text-yellow-300" v-if="darkMode" @click="themeSwitch()" title="Light Mode" aria-label="Light Mode">
                                <icon class="inline align-text-top h-5 w-5" name="sun" alt="Sun Icon"/>
                            </div>
                            <div role="button" class="inline px-2 py-2 font-semibold" v-else @click="themeSwitch()" title="Night Mode" aria-label="Night Mode">
                                <icon class="inline align-text-top h-5 w-5" name="moon" alt="Moon Icon"/>
                            </div>
                        </li>
                        
                    </ul>
                </nav>
            </div>
        </header>
        
        <!-- https://next.router.vuejs.org/api/#router-view-s-v-slot -->
        <!-- Component: VNodes to be passed to a <component>'s is prop -->

        <router-view v-slot="{ Component }">
            <template v-if="Component">
                <keep-alive exclude="Search,Playlists">
                    <suspense>
                        <component :is="Component" :key="$route.path" class="bg-gray-50 dark:bg-gray-700"/>
                        <template #fallback>
                            <div class="flex flex-col flex-grow items-center justify-center">
                                <Loading class="h-28 w-28"/>
                            </div>
                        </template>
                    </suspense>
                </keep-alive>
            </template>
        </router-view>


        <footer class="flex flex-row flex-wrap py-3 justify-center text-center text-sm text-gray-600 dark:text-gray-100 border-t dark:border-0">
                <span class="text-sm px-2 py-1 sm:px-4">Powered by <a class="hover:underline font-semibold" href="https://filmot.com/" title="Filmot.com" rel="noopener" target="_blank">Filmot.com</a> &amp; <a class="hover:underline font-semibold" href="https://archive.org/" title="Internet Archive" rel="noopener" target="_blank">Internet Archive</a></span>
                <span class="text-sm px-2 py-1 sm:px-4">Made by <a class="hover:underline font-semibold" href="https://twitter.com/shubham_nh" title="Twitter" rel="noopener" target="_blank">Shubham Jain</a></span>
                <span class="text-sm px-2 py-1 sm:px-4"><a class="hover:underline font-semibold" href="mailto:human@quiteaplaylist.com" title="Contact E-mail" target="_blank">Contact 📧</a></span>
                <span class="text-sm px-2 py-1 sm:px-4"><a class="hover:underline font-semibold" href="https://www.buymeacoffee.com/shubhamnh" target="_blank">Buy me a ☕</a></span>
                <span class="text-sm px-2 py-1 sm:px-4"><router-link class="hover:underline font-semibold" to="/privacy-policy" title="Privacy Policy">Privacy Policy</router-link></span>
                <!-- <span class="text-sm px-2 py-1 sm:px-4 hover:underline font-semibold"><router-link to="/about/#attributions" title="Attributions">Attributions</router-link></span> -->
                <!-- <span><a href="https://twitter.com/shubham_nh" rel="noopener" target="_blank" title="Twitter"><icon class="inline h-4" name="twitter" alt="Twitter"></a></span> -->
        </footer>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Loading from "./components/Loading.vue";
import HeaderLogo from "@/assets/header-logo.svg?component"

export default defineComponent({
    name: 'App',
    components: { Loading, HeaderLogo },
    // metaInfo: {
    //   // if no sub components specify a metaInfo.title, this title will be used
    //   title: 'quite a playlist',
    //   // all titles will be injected into this template
    //   titleTemplate: '%s - quite a playlist',
    // }
    mounted () {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            this.darkMode = true
        } else {
            document.documentElement.classList.remove('dark')
            this.darkMode = false
        }
    },
    data () {
        return {
            darkMode: false,
        }
    },
    methods: {
        themeSwitch () {

            if (document.documentElement.classList.contains('dark')) {
                localStorage.theme = 'light'
                document.documentElement.classList.remove('dark')
                this.darkMode = false

            } else {
                localStorage.theme = 'dark'
                document.documentElement.classList.add('dark')
                this.darkMode = true
            }
        }

    }
})
</script>
