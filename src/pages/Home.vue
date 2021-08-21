<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 items-center text-center">

        <div class="flex flex-row gap-3 sm:gap-5 lg:gap-10 place-content-center mt-14 mb-9">
                <p class="text-left text-lg sm:text-2xl lg:text-3xl font-extrabold sm:my-4 lg:my-9 filter drop-shadow-sm">
                    <transition enter-active-class="transition animate-glitch" leave-active-class="transition animate-glitch-reverse" mode="out-in">
                        <span class="text-magenta-700" :key="loopTextListPos">
                            {{loopTextList[loopTextListPos]}}
                        </span>
                    </transition>
                    videos in<br>YouTube Playlists?
                </p>
            <img class="w-32 h-auto sm:w-56 lg:w-72" src="../assets/thinking-crayon-man.png" alt="Wondering Human">
        </div>
            
        <div class="flex flex-col w-full">
            <p class="text-lg lg:text-xl italic font-extrabold my-3">Let's find 'em!</p>
            <SearchBar/>
        </div>
        
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchBar from "@/components/SearchBar.vue"

export default defineComponent({
    name: 'Home',
    components: { SearchBar },
    data () {
        return {
            timer : new Object as NodeJS.Timer,
            loopTextList : ['Hidden', 'Deleted', 'Private'],
            loopTextListPos : 0,
        }
    },
    created () {
        this.changeLoopText();
        this.timer = setInterval(this.changeLoopText, 6000);
    },
    methods: {
        changeLoopText () {
            if (this.loopTextListPos === this.loopTextList.length-1)
                this.loopTextListPos = 0
            else this.loopTextListPos++            
        },
        cancelLoopText () {
            clearInterval(this.timer);
        }
    },
    destroyed () {
        this.cancelLoopText()
    }
})
</script>