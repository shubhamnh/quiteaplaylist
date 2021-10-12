<template>
    <div class="flex flex-row items-center my-2 sm:my-4 justify-center gap-4">
        <SearchResultLinkButton :linkUrl="twitterUrlSearch()" linkTitle="Twitter Search" :imgSrc="twitterIcon" imgAlt="Twitter Logo"/>
        <SearchResultLinkButton :linkUrl="braveUrlSearch()" linkTitle="Brave Search" :imgSrc="braveIcon" imgAlt="Brave Logo"/>
        <!-- <SearchResultLinkButton :linkUrl="googleUrlSearch()" linkTitle="Google Search" :imgSrc="googleIcon" imgAlt="Google Logo"/> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchResultLinkButton from "./SearchResultLinkButton.vue"
import twitterIcon from "@/assets/icons/twitter.svg"
import braveIcon from "@/assets/icons/brave.svg"
 
export default defineComponent({
    name: 'SearchResultUrlSearch',
    components: { SearchResultLinkButton },
    props: {
        vidUrl : {
            type: String,
            required: true
        },
    },
    methods: {
        googleUrlSearch () :string {
            return "https://www.google.com/search?q=" + this.vidUrl
        },
        braveUrlSearch () :string {
            return "https://search.brave.com/search?q=" + this.vidUrl.replace('https://www.','')
        },
        twitterUrlSearch () :string {
            return "https://twitter.com/search?q=" + this.vidUrl.replace('https://www.','') + "&src=typed_query&f=live"
        },
    },
    data() {
        return {
            twitterIcon: twitterIcon,
            braveIcon: braveIcon
        }
    },
})

</script>