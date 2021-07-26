<template>
    <div id="vidDetail" v-show="isVisible" class="relative h-auto w-full p-3.5 sm:p-5 rounded-lg bg-white shadow-lg border-2 border-gray-200">

        <span v-if="vidDetail.playlistPosition" class="absolute flex items-center justify-center -top-3 -left-3 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900">
            {{vidDetail.playlistPosition}}
        </span>

        <!-- Number of Snapshots found (Dev only) -->
        <span v-if="checkDev" class="absolute flex items-center justify-center -top-3 -right-3 rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs bg-blue-gray-100 text-gray-900">
            {{vidDetail.snapshots}}
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
                    <div class="flex flex-row">
                        <a :href="vidDetail.url" target="_blank" title="YouTube Video">
                            <h2 class="line-clamp-2 text-gray-800 font-bold">{{ vidDetail.title }}</h2>
                        </a>
                    </div>

                    <p class="text-sm" v-html="vidDetail.published"></p>

                    <div class="my-1.5">
                        <div class="rounded-full w-max px-2 hover:bg-gray-200">
                            <a :href="vidDetail.channelUrl" target="_blank" title="YouTube Channel">
                                <img class="float-left py-1" src="@/assets/icons/user.svg" alt="User">
                                <span class="pl-2"> {{ vidDetail.channelName }} </span>
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
                    <a :href="ytTitleSearch" target="_blank" class="absolute bottom-5 right-5 mx-1 rounded-full p-2 hover:bg-gray-300" title="YouTube Search">
                        <img class="h-5 sm:h-auto" src="@/assets/icons/youtube.svg" alt="YouTube Logo">
                    </a>
                <!-- </div> -->
            </div>

            <!-- Server Error -->
            <div v-else-if="vidDetail.searchStatus === 503 || vidDetail.searchStatus === 500" class="flex flex-col h-full text-center">
                <div class="flex flex-row flex-grow">
                    <div class="flex flex-col w-full justify-evenly">
                        <div>
                            <p v-html="vidDetail.title"></p>
                            <p>Meanwhile, try searching here:</p>
                        </div>
                        <div class="flex flex-row items-center my-2 sm:my-4 justify-center gap-4">
                            <!-- <span class="text-sm">Search On :</span> -->
                            <a class="rounded-full p-1.5 hover:bg-gray-300" :href="braveUrlSearch" target="_blank" title="Brave Search"> 
                                <img class="h-6 sm:h-7" src="@/assets/icons/brave.svg" alt="Brave Logo">
                            </a>
                            <a class="rounded-full p-2 hover:bg-gray-300" :href="googleUrlSearch" target="_blank" title="Google Search">
                                <img class="h-5 sm:h-6" src="@/assets/icons/google.svg" alt="Google Logo">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Video Not Found -->
            <div v-else class="flex flex-col h-full text-center">
                <div class="flex flex-row flex-grow">
                    <div class="flex flex-col w-2/5 justify-center items-center">
                        <!-- <h2 class="text-xl">Oops!</h2> -->
                        <div class="p-2">
                            <img src="@/assets/gem.png" alt="Gem of a Video!">
                        </div>
                    </div>
                    <div class="flex flex-col w-3/5 justify-evenly">
                        <div>
                            <p class="hidden sm:block text-sm">Looks like we have a gem here!<br>Need to do some more digging to find it...</p>
                            <p class="sm:hidden text-sm px-2">Looks like it's a gem!<br>Gotta dig more...</p>
                        </div>
                        <div class="flex flex-row items-center my-2 sm:my-4 justify-center gap-4">
                            <!-- <span class="text-sm">Search On :</span> -->
                            <a class="rounded-full p-1.5 hover:bg-gray-300" :href="braveUrlSearch" target="_blank" title="Brave Search"> 
                                <img class="h-6 sm:h-7" src="@/assets/icons/brave.svg" alt="Brave Logo">
                            </a>
                            <a class="rounded-full p-2 hover:bg-gray-300" :href="googleUrlSearch" target="_blank" title="Google Search">
                                <img class="h-5 sm:h-6" src="@/assets/icons/google.svg" alt="Google Logo">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'VideoDetails',
    props: {
        vidDetail: {
            type: Object as PropType<VideoDetails>,
            required: true,
        },
        viewMode: {
            type: Number,
            required: true
        },
        mode: {
            type: String,
            required: true
        }
    },
    computed: {
        ytTitleSearch () :string {
            return "https://www.youtube.com/results?search_query=" + encodeURIComponent(this.vidDetail.title)
        },
        googleUrlSearch () :string {
            return "https://www.google.com/search?q=" + this.vidDetail.url
        },
        braveUrlSearch () :string {
            return "https://search.brave.com/search?q=" + this.vidDetail.url
        },
        checkDev () {
            return import.meta.env.DEV
        },
        isVisible () {
            if (this.mode === 'playlist') {
                if (this.viewMode === 2) {
                    // Show Not Found
                    if (this.vidDetail.searchStatus === 200) {
                        return false
                    } else return true
                }
                else if (this.viewMode === 1) {
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