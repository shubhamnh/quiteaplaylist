<template>
    <div class="flex flex-col min-h-screen bg-white text-blue-gray-900">
        <header class="flex flex-row items-center bg-white border-b shadow">
            <div class="flex flex-row flex-grow justify-between items-center mx-5 my-3">
                <router-link to="/" title="Home">
                    <img class="inline w-28 h-auto" src="./assets/header-logo.svg" alt="quite a playlist"/>
                </router-link>

                <nav>
                    <ul class="flex flex-row gap-2 sm:gap-5">
                        <li class="relative group">
                            <router-link v-slot="{ isActive }" to="/playlists" class="px-2 py-2 font-semibold" title="Playlists">
                                <svg xmlns="http://www.w3.org/2000/svg" class="inline align-text-top h-5 w-5" viewBox="0 0 30 30"><path d="M4 6h18v2H4z" fill="currentColor"/><path d="M4 12h18v2H4z" fill="currentColor"/><path d="M4 18h12v2H4z" fill="currentColor"/><path d="M21 18l7 5l-7 5V18z" fill="currentColor"/>
                                </svg>

                                <span class="hidden sm:inline sm:pl-1">Playlists</span>
                                <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                            </router-link>
                        </li>

                        <li class="relative group">
                            <router-link v-slot="{ isActive }" to="/find-watch-deleted-private-youtube-video-playlist" class="px-2 py-2 font-semibold" title="Guide">
                                <svg xmlns="http://www.w3.org/2000/svg" class="inline align-text-top h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <!-- Guide -->
                                <span class="hidden sm:inline sm:pl-1">Guide</span>
                                <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                            </router-link>
                    
                        </li>

                        <li class="relative group">
                            <router-link v-slot="{ isActive }" to="/about" class="px-2 py-2 font-semibold" title="About">
                                <svg xmlns="http://www.w3.org/2000/svg" class="inline align-text-top h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="hidden sm:inline sm:pl-1">About</span>
                                <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                            </router-link>
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
                        <component :is="Component" :key="$route.path"/>
                        <template #fallback>
                            <div class="flex flex-col flex-grow items-center justify-center">
                                <Loading class="h-28 w-28"/>
                            </div>
                        </template>
                    </suspense>
                </keep-alive>
            </template>
        </router-view>


        <footer class="flex flex-row flex-wrap py-3 justify-center text-center text-sm text-gray-600 border-t">
                <span class="text-sm px-2 py-1 sm:px-4">Powered by <a class="hover:underline font-semibold" href="https://filmot.com/" title="Filmot.com" rel="noopener" target="_blank">Filmot.com</a> &amp; <a class="hover:underline font-semibold" href="https://archive.org/" title="Internet Archive" rel="noopener" target="_blank">Internet Archive</a></span>
                <span class="text-sm px-2 py-1 sm:px-4">Made by <a class="hover:underline font-semibold" href="https://twitter.com/shubham_nh" title="Twitter" rel="noopener" target="_blank">Shubham Jain</a></span>
                <span class="text-sm px-2 py-1 sm:px-4"><a class="hover:underline font-semibold" href="mailto:human@quiteaplaylist.com" title="Contact E-mail" target="_blank">Contact</a></span>
                <span class="text-sm px-2 py-1 sm:px-4"><a class="hover:underline font-semibold" href="https://www.buymeacoffee.com/shubhamnh" target="_blank">Buy me a ☕</a></span>
                <!-- <span class="text-sm px-2 py-1 sm:px-4 hover:underline font-semibold"><router-link to="/about/#attributions" title="Attributions">Attributions</router-link></span> -->
                <!-- <span><a href="https://twitter.com/shubham_nh" rel="noopener" target="_blank" title="Twitter"><img class="inline h-4" src="@/assets/icons/twitter.svg" alt="Twitter"></a></span> -->
        </footer>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Loading from "./components/Loading.vue";

export default defineComponent({
    name: 'App',
    components: { Loading }
    // metaInfo: {
    //   // if no sub components specify a metaInfo.title, this title will be used
    //   title: 'quite a playlist',
    //   // all titles will be injected into this template
    //   titleTemplate: '%s - quite a playlist',
    // }
})
</script>
