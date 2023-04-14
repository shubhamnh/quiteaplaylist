<template>
    <main class="flex flex-col flex-grow justify-center items-center px-4 md:px-8 py-3 text-left">
    <div class="max-w-2xl px-3 py-4 sm:py-8 space-y-1">
        <h1 class="text-xl md:text-2xl font-semibold my-3 md:my-5">Contact</h1>
        <p>Have questions or feedback?</p>
        <p><i>Get in touch!</i></p>
        <div class="pt-5 space-y-1">
            <div>
                <icon class="inline align-text-top h-5 w-5" name="at-symbol" alt="Email Icon"/> <a :href="`mailto:`+email">{{ email }}</a>
            </div>
            <div>
                <icon class="inline align-text-top h-5 w-5 mr-1.5" name="twitter-outline" alt="Twitter Icon"/><a :href="twitterUrl" target="_blank" rel="noopener">{{ twitterHandle }}</a>
            </div>
        </div>
    </div>
    </main>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Contact',
    data() {
      return {
        email: 'human@quiteaplaylist.com',
        twitterHandle: 'shubham_nh',
      };
    },
    computed: {
      twitterUrl(): string {
        return `https://twitter.com/${this.twitterHandle}`;
      },
    },
  });
  </script>