<template>
    <div id="vidDetail" v-show="isVisible" class="relative h-auto min-h-[7rem] w-full p-3.5 sm:p-5 rounded-lg bg-white shadow-md border border-gray-200">

        <span v-if="playlistPos" class="absolute flex items-center justify-center -top-3 -left-3 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900">
            {{playlistPos}}
        </span>

        <!-- Number of Snapshots found (Dev only) -->
        <span v-if="checkDev()" class="absolute flex items-center justify-center -top-3 -right-3 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900">
            {{vidDetail.snapshots}}
        </span>

        <!-- Number of Snapshots Parsed (Dev only) -->
        <span v-if="checkDev()" class="absolute flex items-center justify-center -top-3 right-6 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900">
            {{vidDetail.snapshotsParsed}}
        </span>

        <div class="h-full" v-if="vidDetail.searchStatus">

            <!-- Video Found -->
            <div v-if="vidDetail.searchStatus === 200" class="flex flex-col h-full text-left">
                <!-- <span class="absolute bottom-0 left-0 rounded-tr-lg text-xs p-1.5 bg-gray-200">
                    <a :href="vidDetail.waybackUrl" target="_blank" title="Internet Archive Snapshot">
                        {{vidDetail.snapshotTime}}
                    </a>
                </span> -->

                <!-- <div> -->
                    
                        <p class="line-clamp-2 break-words text-gray-800 pb-1 font-bold">
                            <a :href="vidDetail.url" class="hover:underline" target="_blank" v-html="vidDetail.title" :title="vidDetail.title"></a>
                        </p>

                    <p class="text-sm" v-html="vidDetail.published"></p>

                    <div v-if="vidDetail.channelName" class="my-2 w-10/12 sm:w-full">
                        <div class="rounded-full w-max px-2 border hover:bg-gray-200">
                            <a :href="vidDetail.channelUrl" target="_blank" title="YouTube Channel">
                                <img class="inline float-left py-1" src="@/assets/icons/user.svg" alt="User">
                                <p class="inline pl-2 overflow-hidden"> {{ vidDetail.channelName }} </p>
                            </a>
                        </div>
                    </div>
                    
                    <!-- <div>
                        <a :href="vidDetail.channelUrl" target="_blank">
                            <div class="flex flex-row flex-wrap items-center p-0.5 my-1.5 gap-2 text-base">
                                <div>
                                    <img src="@/assets/icons/user.svg" alt="User">
                                </div>
                                <div>
                                    <span class="line-clamp-1"> {{ vidDetail.channelName }} </span>
                                </div>
                            </div>
                        </a>
                    </div> -->

                    <p class="hidden md:line-clamp-2 w-10/12 my-2" v-html="vidDetail.description"></p>
                <!-- </div> -->

                <!-- <div class="flex flex-row flex-nowrap items-center justify-end gap-2"> -->
                    <!-- <p class="text-sm">Find Similar :</p> -->
                    <a :href="ytTitleSearch" target="_blank" class="absolute bottom-5 right-5 mx-1 rounded-full p-2 shadow-xl border bg-white hover:bg-gray-200" title="YouTube Search">
                        <img class="h-5 sm:h-auto" src="@/assets/icons/youtube.svg" alt="YouTube Logo">
                    </a>
                <!-- </div> -->
            </div>

            <!-- Server Error -->
            <div v-else-if="vidDetail.searchStatus === 521 || vidDetail.searchStatus === 503 || vidDetail.searchStatus === 502 || vidDetail.searchStatus === 500" class="flex flex-col h-full text-center">
                <div class="flex flex-row flex-grow">
                    <div class="flex flex-col w-full justify-evenly">
                        <div>
                            <p v-html="vidDetail.title"></p>
                            <p>Or try searching here:</p>
                        </div>
                        <UrlSearch :vidUrl="vidDetail.url"/>
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
                        <UrlSearch :vidUrl="vidDetail.url"/>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Loading -->
        <div v-else class="flex h-20 sm:h-40 w-auto items-center justify-center">
            <div class="multi-ripple h-12 w-12">
                <div></div>
                <div></div>
            </div>
            <!-- <h3 class="justify-self center font-extrabold text-gray-800 animate-pulse">Loading...</h3> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UrlSearch from './UrlSearch.vue'

export default defineComponent({
    name: 'VideoDetails',
    components: { UrlSearch },
    props: {
        vidDetail: {
            type: Object,
            required: true,
        },
        activeViewMode: {
            type: Number,
            required: true
        },
        playlistPos: {
            type: Number,
        }
    },
    methods: {
        checkDev () {
            return import.meta.env.DEV
        },
    },
    computed: {
        ytTitleSearch () :string {
            return "https://www.youtube.com/results?search_query=" + encodeURIComponent(this.vidDetail.title)
        },
        isVisible () {
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