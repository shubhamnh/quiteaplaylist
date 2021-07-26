<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center">
        <transition name="fade">
            <div class="flex flex-col place-content-center pt-20">
                <div class="my-5">
                    <p class="text-lg font-extrabold uppercase my-1">Missing Videos from your YouTube playlist treasury?</p>
                    <p class="text-xs font-extrabold my-1.5">It's a crappy feeling :(</p>
                </div>
                <p class="text-xl font-extrabold uppercase my-4">Let's find them!</p>
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