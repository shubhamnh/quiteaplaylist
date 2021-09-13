<template>
    <div class="flex flex-col min-h-screen bg-white text-blue-gray-900">
        <div class="flex flex-row items-center bg-white border-b-2 shadow-sm">
            <ul class="flex flex-row flex-grow justify-between items-center mx-5 my-3">
                <li><router-link to="/" title="Home"><img class="inline w-28 h-auto" src="./assets/header-logo.svg" alt="quite a playlist"/></router-link></li>
                <div class="flex flex-row gap-2 sm:gap-5">
                    <li class="relative group">
                        <router-link v-slot="{ isActive }" to="/find-watch-deleted-private-youtube-video-playlist" class="px-1 sm:px-2 py-2 font-semibold" title="Guide">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline align-text-top h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg> 
                            Guide
                            <!-- <span class="hidden sm:inline sm:pl-1">Guide</span> -->
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
                </div>
            </ul>
        </div>
        
        <!-- https://next.router.vuejs.org/api/#router-view-s-v-slot -->
        <!-- Component: VNodes to be passed to a <component>'s is prop -->
        <router-view v-slot="{ Component }">
            <keep-alive exclude="Search">
                <component :is="Component" :key="$route.path"/>
            </keep-alive>
        </router-view>

        <!-- <keep-alive>
            <router-view :key="$route.query.url"></router-view>
        </keep-alive> -->

        <div class="flex flex-row flex-wrap py-3 justify-center text-center text-sm text-gray-600 border-t-2">
            <span class="text-sm px-2 py-1 sm:px-4">Powered by <a class="hover:underline font-semibold" href="https://archive.org/" target="_blank" title="Internet Archive">Internet Archive</a></span>
            <span class="text-sm px-2 py-1 sm:px-4">Made by <a class="hover:underline font-semibold" href="https://twitter.com/shubham_nh" target="_blank" title="Twitter">Shubham Jain</a></span>
            <span class="text-sm px-2 py-1 sm:px-4 hover:underline font-semibold"><router-link to="/about/#attributions" title="Attributions">Attributions</router-link></span>
            <!-- <span><a href="https://twitter.com/shubham_nh" target="_blank" title="Twitter"><img class="inline h-4" src="@/assets/icons/twitter.svg" alt="Twitter"></a></span> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
    // metaInfo: {
    //   // if no sub components specify a metaInfo.title, this title will be used
    //   title: 'quite a playlist',
    //   // all titles will be injected into this template
    //   titleTemplate: '%s - quite a playlist',
    // }
})
</script>
