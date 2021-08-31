<template>
    <div class="flex flex-row items-center my-2 sm:my-4 justify-center gap-4">
        <!-- <span class="text-sm">Search On :</span> -->
        <a class="rounded-full p-1.5 shadow-md md:shadow-lg border hover:bg-gray-300" :href="twitterUrlSearch()" target="_blank" title="Twitter Search"> 
            <img class="h-6 sm:h-7" src="@/assets/icons/twitter.svg" alt="Twitter Logo">
        </a>
        <a class="rounded-full p-1.5 shadow-md md:shadow-lg border hover:bg-gray-300" :href="braveUrlSearch()" target="_blank" title="Brave Search"> 
            <img class="h-6 sm:h-7" src="@/assets/icons/brave.svg" alt="Brave Logo">
        </a>
        <!-- <a class="rounded-full p-2 hover:bg-gray-300" :href="googleUrlSearch()" target="_blank" title="Google Search">
            <img class="h-5 sm:h-6" src="@/assets/icons/google.svg" alt="Google Logo">
        </a> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
 
export default defineComponent({
    name: 'UrlSearch',
    props: {
        vidUrl : {
            type: String,
            required: true
        }
    },
    methods: {
        googleUrlSearch () :string {
            return "https://www.google.com/search?q=" + this.vidUrl
        },
        braveUrlSearch () :string {
            return "https://search.brave.com/search?q=" + this.vidUrl.replace('https://www.','')
        },
        twitterUrlSearch () :string {
            return "https://twitter.com/search?q=" + this.vidUrl
        },
    },
})

</script>

<style>

</style>