<template>
    <a :href="channelUrl"
        rel="noopener" target="_blank"
        title="YouTube Channel"
        class="rounded-full w-max px-2 mt-3 mb-2 border hover:bg-gray-100 dark:hover:bg-gray-900"
        @click.stop>
        <icon class="inline align-text-bottom h-6 w-6 py-1" name="user" alt="User"/>
        <span class="inline pl-1 overflow-hidden">
            {{ channelName }} </span>
        <!-- <span v-else class="inline pl-1 overflow-hidden italic"></span> -->
    </a>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SearchResultChannel',
    props: {
        channelName: {
            type: String,
            required: false,
        },
        channelUrl: {
            type: String,
            required: false
        },
    },
})
</script>
