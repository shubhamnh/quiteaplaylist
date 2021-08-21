<template>
    <div class="flex flex-col min-h-screen bg-blue-gray-050 text-blue-gray-900">
        <div class="flex flex-row items-center bg-white shadow-sm">
            <ul class="flex flex-row flex-grow justify-between items-center mx-5 my-3">
                <li><router-link to="/" title="Home"><img class="inline w-28 h-auto" src="./assets/header-logo.svg" alt="quite a playlist"></router-link></li>
                <div class="flex flex-row gap-4 sm:gap-5">
                    <li class="relative group">
                        <router-link to="/help" v-slot="{ isActive }" class="px-1 sm:px-2 py-2 font-semibold" title="Help">
                            Help
                            <span aria-hidden="true" :class="[isActive && '!scale-x-100']" class="absolute -bottom-2 left-0 w-full scale-x-0 transform group-hover:scale-x-100 transition duration-200 ease-in-out mt-1 border-b-2 rounded-t-full border-magenta-500"></span>
                        </router-link>
                        
                    </li>
                    <li class="relative group">
                        <router-link to="/about" v-slot="{ isActive }" class="px-2 py-2 font-semibold" title="About">
                            About
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

        <div class="py-3 text-center text-sm text-gray-600">
            <!-- <p>Powered by <a href="https://archive.org/" target="_blank" title="Internet Archive">Internet Archive</a></p> -->
            <!-- <p>Icons by <a href="https://www.freepik.com"  target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">flaticon.com</a></p> -->
            <!-- Illustration by <a href="https://icons8.com/illustrations/author/5c07e68d82bcbc0092519bb6">Icons 8</a> from <a href="https://icons8.com/illustrations">Ouch!</a> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
})
</script>
