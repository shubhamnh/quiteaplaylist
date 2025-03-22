<template>
    <div @click.self="$emit('resultModalSwitch')" class="h-full w-full fixed top-0 left-0 bg-blue-gray-300 bg-opacity-60 sm:grid sm:place-items-center">
        <div class="flex flex-col p-4 m-auto h-screen w-full max-h-screen sm:h-4/5 sm:w-8/12 sm:max-w-3xl sm:rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200">

            <div class="flex flex-row justify-between">
                <div class="place-self-end text-sm">
                    <span v-if="playlistPos">Playlist Position: {{playlistPos}}
                    </span>
                    <!-- <span class="mx-2">·</span> -->
                </div>
                <button class="p-3 my-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 shadow-xl" @click="$emit('resultModalSwitch')">
                    <icon name="x" alt="Close"/>
                </button>
            </div>

            <div class="flex flex-col py-1 border-b">

                <a :href="vidDetail.url" class="text-lg break-words text-gray-800 dark:text-gray-100 mb-1 font-bold hover:underline" rel="noopener" target="_blank" v-html="vidDetail.title" :title="vidDetail.title"></a>

                <div>
                    <span class="mr-4" v-html="vidDetail.published"></span>

                    <span>
                        <icon v-if="vidDetail.status === 'Deleted'" class="inline h-4 mb-1" name="trash-solid" title="Deleted" alt="Deleted"/>
                        <icon v-if="vidDetail.status === 'Private'" class="inline h-4 mb-1" name="lock-closed-solid" title="Private" alt="Private"/>
                    </span>
                </div>

                <SearchResultChannel v-if="vidDetail.channelName || vidDetail.channelUrl" :channelName="vidDetail.channelName"
                    :channelUrl="vidDetail.channelUrl" />
            </div>

            <div class="flex flex-col flex-grow overflow-auto">
                <p class="text-sm my-3 mx-2 break-words whitespace-pre-line" v-html="vidDetail.description || '<i>No Description Available</i>'"></p>
            </div>

            <div class="justify-self-end flex flex-row items-center justify-between pt-4 border-t">
                <div>
                    <p class="inline">Source:</p>

                    <div class="inline"
                        v-if="vidDetail.source == 'wayback'">
                        <a :href="(vidDetail.waybackUrl)?.replace('id_/','if_/')"
                            rel="noopener" target="_blank"
                            class="inline rounded-full py-1 pl-1 pr-2 mx-2 border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900"
                            title="WayBack Snapshot">
                            Wayback Machine
                        </a>
                        <p class="mt-2">As on:
                            {{vidDetail.snapshotTime}}</p>
                    </div>

                    <span v-else-if="vidDetail.source == 'yt'">
                        Browser Cache
                    </span>

                    <a v-else-if="vidDetail.source == 'filmot'" href="https://filmot.com/" rel="noopener" target="_blank" class="inline rounded-full py-1 px-2 mx-2 border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900" title="Filmot.com">
                        Filmot.com
                    </a>

                    <a v-else-if="vidDetail.source == 'se'" :href="'https://search.brave.com/search?q='+vidDetail.url" rel="noopener" target="_blank" class="inline rounded-full py-1 px-2 mx-2 border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900" title="Brave Search">
                        Brave Search
                    </a>
                </div>
                <div class="flex flex-row">
                    <SearchResultLinkButton class="mx-1 shadow-xl" :linkUrl="webArchiveSearch" linkTitle="Web Archive Search" iconFile="internetarchive" imgAlt="Web Archive Search"/>

                    <SearchResultLinkButton v-if="vidDetail.waybackVideo" class="mx-2 shadow-xl" :linkUrl="vidDetail.waybackVideo" linkTitle="Play Video" iconFile="play" imgAlt="Play"/>

                    <SearchResultLinkButton class="mx-1 shadow-xl" :linkUrl="ytTitleSearch" linkTitle="YouTube Title Search" iconFile="search" imgAlt="Youtube Title Search"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SearchResultChannel from "./SearchResultChannel.vue"
import SearchResultLinkButton from "./SearchResultLinkButton.vue"

export default defineComponent({
    name: 'SearchResultModal',
    components: { SearchResultChannel, SearchResultLinkButton },
    props: {
        vidDetail: {
            type: Object as PropType<VideoDetails>,
            required: true,
        },
        playlistPos: {
            type: Number,
            required: false
        },
        ytTitleSearch: {
            type: String,
            required: true
        },
        webArchiveSearch: {
            type: String,
            required: true
        }
    },
    // beforeRouteLeave() {
    //     console.log('what is happening?')
    //     this.$emit('resultModalSwitch')
    //     return false
    // }
})
</script>
