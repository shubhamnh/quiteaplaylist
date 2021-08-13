<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center">
        <transition name="fade">
            <div class="flex flex-col place-content-center pt-20">
                <div class="my-5">
                    <p class="text-lg font-extrabold my-1">Missing videos from your YouTube Playlists?</p>
                </div>
                <p class="text-lg font-extrabold my-4">Let's find Them!</p>
            </div>
        </transition>
        <SearchBar/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchBar from "@/components/SearchBar.vue"

export default defineComponent({
    name: 'Home',
    components: { SearchBar },
})
</script>