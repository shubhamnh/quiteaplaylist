<template>
    <div class="w-11/12 max-w-sm my-5 sm:my-8 mx-auto">
        <img loading="lazy" class="rounded-md shadow-lg" :src="src" :alt="caption">
        <p v-if="caption" class="text-sm text-center font-extralight italic pt-3">{{ caption }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'GuideImage',
    props: {
        src : {
            type : String,
            required: true
        },
        caption: {
            type: String,
            default: '',
            required : false
        }
    },
})
</script>
