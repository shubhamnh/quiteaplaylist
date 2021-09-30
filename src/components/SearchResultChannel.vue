<template>
    <a :href="channelUrl"
        rel="noopener" target="_blank"
        title="YouTube Channel"
        class="rounded-full w-max px-2 mt-3 mb-2 border hover:bg-gray-200"
        @click.stop>
        <img class="inline align-text-bottom py-1"
            src="@/assets/icons/user.svg"
            alt="User">
        <span class="inline pl-1 overflow-hidden">
            {{ channelName }} </span>
    </a>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SearchResultChannel',
    props: {
        channelName: {
            type: String,
            required: true
        },
        channelUrl: {
            type: String,
            required: false
        },
    },
})
</script>
