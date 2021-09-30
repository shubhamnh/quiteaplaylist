<template>
    <div @click.self="$emit('resultModalSwitch')" class="h-full w-full fixed top-0 left-0 bg-blue-gray-300 bg-opacity-60 sm:grid sm:place-items-center" >
            <div class="flex flex-col p-4 m-auto h-screen w-full max-h-screen sm:w-auto sm:h-auto sm:max-w-lg sm:rounded-lg bg-white">

                <div class="flex flex-row justify-between">
                    <div class="place-self-end text-sm">
                        <span v-if="playlistPos">Playlist Position: {{playlistPos}}
                        </span>
                        <img v-if="vidDetail.status === 'Deleted'" class="inline h-4 align-text-top mx-2" src="@/assets/icons/trash-solid.svg" alt="Deleted">
                        <img v-if="vidDetail.status === 'Private'" class="inline h-4 align-text-top mx-2" src="@/assets/icons/lock-closed-solid.svg" alt="Private">
                    </div>
                    <button class="p-3 my-2 border rounded-full hover:bg-gray-200 shadow-xl" @click="$emit('resultModalSwitch')">
                        <img src="@/assets/icons/x.svg" alt="Close">
                    </button>
                </div>

                <div class="flex flex-col py-1 border-b">

                    <a :href="vidDetail.url" class="text-lg break-words text-gray-800 mb-1 font-bold hover:underline" rel="noopener" target="_blank" v-html="vidDetail.title" :title="vidDetail.title"></a>
                    <p v-html="vidDetail.published"></p>

                    <SearchResultChannel v-if="vidDetail.channelName" :channelName="vidDetail.channelName"
                        :channelUrl="vidDetail.channelUrl" />
                </div>

                <div class="flex flex-col flex-grow overflow-auto">
                    <p class="text-sm my-3 mx-2 break-words" v-html="vidDetail.description || '<i>No Description Available</i>'"></p>
                </div>

                <div class="justify-self-end flex flex-row items-center justify-between pt-4 border-t">
                    <div>
                        <p class="inline">Source:</p>

                        <div class="inline"
                            v-if="vidDetail.source == 'wayback'">
                            <a :href="(vidDetail.waybackUrl)?.replace('id_/','if_/')"
                                rel="noopener" target="_blank"
                                class="inline rounded-full py-1 pl-1 pr-2 mx-2 border bg-white hover:bg-gray-200"
                                title="WayBack Snapshot">
                                Wayback Machine
                            </a>
                            <p class="mt-2">As on:
                                {{vidDetail.snapshotTime}}</p>
                        </div>

                        <a v-else :href="'https://search.brave.com/search?q='+vidDetail.url" rel="noopener" target="_blank" class="inline rounded-full py-1 px-2 mx-2 border bg-white hover:bg-gray-200" title="Brave Search">
                            Brave Search
                        </a>
                    </div>
                    <a :href="ytTitleSearch" rel="noopener" target="_blank" class="mx-1 rounded-full p-3 shadow-xl border bg-white hover:bg-gray-200" title="YouTube Search">
                        <img class="h-5 sm:h-auto" src="@/assets/icons/search.svg" alt="YouTube Search">
                    </a>
                </div>
            </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SearchResultChannel from "./SearchResultChannel.vue";

export default defineComponent({
    name: 'SearchResultModal',
    components: {SearchResultChannel},
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
        }
    }
})
</script>
