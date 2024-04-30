<template>
    <div class="flex flex-row items-center my-3 sm:my-4 justify-center gap-3">
        <SearchResultLinkButton :linkUrl="twitterUrlSearch()" linkTitle="X Twitter Search" iconFile="twitter-x" imgAlt="X Twitter Logo"/>
        <SearchResultLinkButton :linkUrl="archiveUrlSearch()" linkTitle="Internet Archive Search" iconFile="internetarchive" imgAlt="Internet Archive Logo"/>
        <SearchResultLinkButton :linkUrl="braveUrlSearch()" linkTitle="Brave Search" iconFile="brave" imgAlt="Brave Logo"/>
        <SearchResultLinkButton :linkUrl="redditUrlSearch()" linkTitle="Reddit Search" iconFile="reddit" imgAlt="Reddit Logo"/>

        <!-- <SearchResultLinkButton :linkUrl="googleUrlSearch()" linkTitle="Google Search" iconFile="google" imgAlt="Google Logo"/> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchResultLinkButton from "./SearchResultLinkButton.vue"
 
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
        redditUrlSearch () :string {
            return "https://www.reddit.com/search/?q=" + this.vidUrl.replace('https://www.youtube.com/watch?v=','')
        },
        twitterUrlSearch () :string {
            return "https://twitter.com/search?q=" + this.vidUrl.replace('https://www.','') + "&src=typed_query&f=live"
        },
        archiveUrlSearch () :string {
            return "https://web.archive.org/web/" + this.vidUrl
        },

    },
})

</script>