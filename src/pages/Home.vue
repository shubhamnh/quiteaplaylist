<template>
    <div class="flex-grow">
        <section class="flex flex-col relative bg-magenta-100 sm:gap-5 py-5 md:py-10 px-4">
            <!-- <div class="flex flex-row flex-wrap gap-5 lg:gap-10 place-content-center my-5"> -->
                
                <div class="px-5 my-2 sm:my-5 sm:flex sm:flex-row gap-5 lg:gap-10 place-content-center">
                    <div class="flex py-5 sm:inline-block sm:py-0">
                        <h1 class="text-left self-start font-extrabold text-2xl lg:text-3xl sm:my-4 lg:my-9 filter drop-shadow-sm">
                            <transition enter-active-class="transition animate-glitch" leave-active-class="transition animate-glitch-reverse" mode="out-in">
                                <span class="text-magenta-700" :key="loopTextListPos">
                                    {{loopTextList[loopTextListPos]}}
                                </span>
                            </transition>
                            videos in<br>YouTube Playlists?
                        </h1>
                    </div>
                    <div class="flex justify-end py-5 sm:inline-block sm:py-0">
                        <img class="w-56 h-auto md:w-72" src="../assets/thinking-crayon-man.png" alt="Wondering Human">
                    </div>
                </div>
            <!-- </div> -->
        
            <div class="flex flex-col w-full text-center my-5">
                <p class="text-lg md:text-xl lg:text-2xl italic font-bold my-1 md:my-3">Let's find 'em!</p>
                <SearchBar/>
            </div>
        </section>
        
        <section class="flex flex-col relative max-w-3xl md:mx-auto py-10 md:py-16 px-4">
            <div class="flex flex-col gap-3 md:gap-5">
                <h1 class="text-center font-extrabold text-xl sm:text-2xl lg:text-3xl filter drop-shadow-sm">Demo using YouTube Mobile App</h1>
                <div class="aspect-w-16 aspect-h-9 mx-2 my-3 lg:my-5">
                    <iframe src="https://www.youtube.com/embed/kN1xwKxjS08?rel=0&iv_load_policy=3" srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/kN1xwKxjS08?autoplay=1><img src=https://img.youtube.com/vi/kN1xwKxjS08/maxresdefault.jpg alt='Find and Watch Deleted and Private Videos Easily! | quiteaplaylist.com'><span>▶</span></a>" 
                        loading="lazy"
                        title="Find and Watch Deleted and Private Videos Easily! | quiteaplaylist.com" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </section>

        <section class="flex flex-col relative bg-magenta-100 py-10 px-4">
            <div class="my-2 lg:my-4">
                <h3 class="text-center font-extrabold text-xl lg:text-2xl filter drop-shadow-sm">Found this useful?
                </h3>
                <p class="text-center text-base md:text-lg lg:text-xl italic my-1">Consider supporting!</p>
            </div>
            <div class="flex flex-row flex-wrap gap-5 lg:gap-10 place-content-center items-center my-5">
                <a href="https://archive.org/donate" target="_blank">
                    <img class="bg-white w-52 rounded-md shadow-md" src="../assets/internet-archive.png" alt="Donate to Internet Archive">
                </a>
                <a href="https://www.buymeacoffee.com/shubhamnh" target="_blank">
                    <img class="w-52 rounded-md shadow-md" src="../assets/bmc-yellow.png" alt="Buy me a Coffee">
                </a>
            </div>
        </section>
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