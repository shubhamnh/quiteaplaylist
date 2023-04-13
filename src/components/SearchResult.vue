<template>
    <div id="vidDetail" v-show="isVisible" :class="vidDetail.searchStatus === 200 ? 'shadow cursor-pointer' : ''" class="relative h-auto min-h-[7rem] w-full p-3.5 sm:p-5 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600" @click="resultModalSwitch()">

        <span v-if="playlistPos" class="absolute flex items-center justify-center -top-3 -left-3 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900 dark:bg-blue-gray-900 dark:text-white">
            {{playlistPos}}
        </span>

        <!-- Number of Snapshots found (Dev only) -->
        <span v-if="checkDev()" class="absolute flex items-center justify-center -top-3 -right-3 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900 dark:bg-blue-gray-900 dark:text-white">
            {{vidDetail.snapshots}}
        </span>

        <!-- Number of Snapshots Parsed (Dev only) -->
        <span v-if="checkDev()" class="absolute flex items-center justify-center -top-3 right-6 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900 dark:bg-blue-gray-900 dark:text-white">
            {{vidDetail.snapshotsParsed}}
        </span>

        <div class="h-full" v-if="vidDetail.searchStatus">

            <!-- Video Found -->
            <div v-if="vidDetail.searchStatus === 200" class="flex flex-col h-full text-left">

                <p class="line-clamp-2 break-words text-gray-800 dark:text-gray-100 pb-1 font-bold" v-html="vidDetail.title">
                </p>

                <p class="text-sm" v-html="vidDetail.published"></p>

                <SearchResultChannel v-if="vidDetail.channelName || vidDetail.channelUrl" :channelName="vidDetail.channelName"
                    :channelUrl="vidDetail.channelUrl" />

                <p class="hidden md:line-clamp-2 break-words w-10/12 my-2" v-html="vidDetail.description"></p>

                <SearchResultLinkButton class="absolute bottom-5 right-5 mx-1" :linkUrl="ytTitleSearch" linkTitle="YouTube Search" iconFile="search" imgAlt="Search"/>
            </div>

            <!-- Server Error -->
            <div v-else-if="vidDetail.searchStatus === 521 || vidDetail.searchStatus === 503 || vidDetail.searchStatus === 502 || vidDetail.searchStatus === 500" class="flex flex-col h-full text-center">
                <div class="flex flex-row flex-grow">
                    <div class="flex flex-col w-full justify-evenly">
                        <div>
                            <p v-html="vidDetail.title"></p>
                            <p>Or try searching here:</p>
                        </div>
                        <SearchResultUrlSearch :vidUrl="vidDetail.url"/>
                    </div>
                </div>
            </div>
            
            <!-- Video Not Found -->
            <div v-else class="flex flex-col h-full text-center">
                <div class="flex flex-row flex-grow">
                    <div class="flex flex-col w-2/5 justify-center items-center">
                        <div class="p-2">
                            <img class="max-h-16 md:max-h-20" src="@/assets/gem.png" alt="Gem of a Video!">
                        </div>
                    </div>
                    <div class="flex flex-col w-3/5 justify-evenly">
                        <div>
                            <p class="hidden sm:block text-sm">Looks like we have a gem here!<br/>Try digging some more...</p>
                            <p class="sm:hidden text-sm px-2">Looks like it's a gem!<br/>Try digging more...</p>
                        </div>
                        <SearchResultUrlSearch :vidUrl="vidDetail.url"/>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Loading -->
        <div v-else class="flex h-20 sm:h-40 w-auto items-center justify-center">
            <Loading class="h-12 w-12"/>
            <!-- <p class="justify-self center font-extrabold text-gray-800 animate-pulse">Loading...</p> -->
        </div>

        <Teleport to="body">
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <SearchResultModal v-if="showResultModal" :vidDetail="vidDetail" :playlistPos="playlistPos" :ytTitleSearch="ytTitleSearch" @resultModalSwitch="resultModalSwitch()"/>
            </transition>
        </Teleport>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Loading from './Loading.vue'
import SearchResultUrlSearch from './SearchResultUrlSearch.vue'
import SearchResultModal from './SearchResultModal.vue'
import SearchResultChannel from "./SearchResultChannel.vue"
import SearchResultLinkButton from "./SearchResultLinkButton.vue"

export default defineComponent({
    name: 'SearchResult',
    components: { SearchResultChannel, SearchResultUrlSearch, SearchResultModal, SearchResultLinkButton, Loading },
    props: {
        vidDetail: {
            type: Object as PropType<VideoDetails>,
            required: true,
        },
        activeViewMode: {
            type: Number,
            required: true
        },
        playlistPos: {
            type: Number,
            required: false
        }
    },
    data () {
        return {
            showResultModal: false,
        }
    },
    methods: {
        checkDev () {
            return import.meta.env.DEV
        },
        resultModalSwitch() {
            if (this.vidDetail.searchStatus === 200)
                this.showResultModal = !this.showResultModal
        }
    },
    computed: {
        ytTitleSearch () :string {
            return "https://www.youtube.com/results?search_query=" + encodeURIComponent(String(this.vidDetail.title))
        },
        isVisible () :boolean {
            if (this.playlistPos) {
                if (this.activeViewMode === 2) {
                    // Show Not Found
                    if (this.vidDetail.searchStatus === 200) {
                        return false
                    } else return true
                }
                else if (this.activeViewMode === 1) {
                    // Show Found
                    if (this.vidDetail.searchStatus === 200) {
                        return true
                    } else return false
                } else {
                    return true
                }
            } else {
                // Show All
                return true
            }
        }
    },
})
</script>