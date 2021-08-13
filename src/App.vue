<template>
    <div class="flex flex-col min-h-screen bg-blue-gray-050 text-gray-800">
        <div class="flex flex-row items-center">
            <ul class="flex flex-row flex-grow justify-between items-center mx-5 my-3">
                <li><router-link to="/" title="Home"><img class="inline w-28 h-auto m-2" src="./assets/header-logo-small.png" alt="QuiteAPlaylist"></router-link></li>
                <div class="flex flex-row gap-4">
                    <li><router-link to="/help" title="Help">Help</router-link></li>
                    <li><router-link to="/about" title="About">About</router-link></li>
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

        <div class="py-3 text-center text-sm text-gray-600">
            <p>Powered by <a href="https://archive.org/" target="_blank" title="Internet Archive">Internet Archive</a></p>
            <!-- <p>Icons by <a href="https://www.freepik.com"  target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">flaticon.com</a></p> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
})
</script>
