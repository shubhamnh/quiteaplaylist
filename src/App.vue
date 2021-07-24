<template>
    <div class="flex flex-col min-h-screen bg-blue-gray-050">
        <div class="flex flex-row items-center">
            <ul class="flex flex-row flex-grow justify-between items-center m-5">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
            </ul>
        </div>

        <router-view></router-view>

        <div class="py-3 text-center text-sm text-gray-600">
            <p>Powered by <a href="https://archive.org/" target="_blank" title="Internet Archive">Internet Archive</a></p>
            <p>Icons by <a href="https://www.freepik.com"  target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">flaticon.com</a></p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import VLink from '@/components/VLink.vue'
// import routes from './routes'

export default defineComponent({
    name: 'App',
})
</script>

<style>
/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
} */
</style>
