<template>
    <a :href="linkUrl" rel="noopener" target="_blank" class="rounded-full p-2 shadow md:shadow-lg border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900" @click.stop :title="linkTitle" >
        <!-- <img class="h-5 sm:h-6" :src="imgSrc" :alt="imgAlt"> -->
        <icon class="h-4 w-4" :name="iconFile" :alt="imgAlt"/>
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
        // imgSrc: {
        //     type: String,
        //     required: true
        // },
        imgAlt: {
            type: String,
            required: true
        },
        iconFile: {
            type: String,
            required: true
        }
    }
})
</script>
