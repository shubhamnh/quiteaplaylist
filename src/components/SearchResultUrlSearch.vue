<template>
    <div class="flex flex-row items-center my-2 sm:my-4 justify-center gap-4">
        <SearchResultLinkButton :linkUrl="twitterUrlSearch()" linkTitle="Twitter Search" iconFile="twitter" imgAlt="Twitter Logo"/>
        <SearchResultLinkButton :linkUrl="braveUrlSearch()" linkTitle="Brave Search" iconFile="brave" imgAlt="Brave Logo"/>
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
        twitterUrlSearch () :string {
            return "https://twitter.com/search?q=" + this.vidUrl.replace('https://www.','') + "&src=typed_query&f=live"
        },
    },
})

</script>