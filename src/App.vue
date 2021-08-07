<template>
    <div class="flex flex-col min-h-screen bg-blue-gray-050 text-gray-800">
        <div class="flex flex-row items-center">
            <ul class="flex flex-row flex-grow justify-between items-center mx-5 my-3">
                <li><router-link to="/">WhatVideo? (Test)</router-link></li>
                <li><router-link to="/about">About</router-link></li>
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
            <p>Icons by <a href="https://www.freepik.com"  target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">flaticon.com</a></p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
})
</script>
