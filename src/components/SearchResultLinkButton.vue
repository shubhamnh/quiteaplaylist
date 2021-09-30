<template>
    <a :href="linkUrl" rel="noopener" target="_blank" class="rounded-full p-2 shadow md:shadow-lg border bg-white hover:bg-gray-200" @click.stop :title="linkTitle" >
        <img class="h-5 sm:h-6" :src="imgSrc" :alt="imgAlt">
    </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SearchResultLinkButton',
    props: {
        linkUrl: {
            type: String,
            required: true
        },
        linkTitle: {
            type: String,
            required: true
        },
        imgSrc: {
            type: String,
            required: true
        },
        imgAlt: {
            type: String,
            required: true
        }
    }
})
</script>
