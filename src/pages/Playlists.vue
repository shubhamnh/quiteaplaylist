<template>
    <main class="flex flex-col flex-grow items-center px-4 md:px-8 py-3 bg-gray-50">
        <div class="flex flex-col flex-grow max-w-2xl px-3 py-4 sm:py-8">
            <h1 class="text-xl md:text-2xl font-semibold my-2 md:my-3">Playlists</h1>
            <p class="text-sm mb-7">The Playlists you search for are saved in your browser automatically. You can see all of them here to manage them better.</p>
            
            <div v-for="(playlist, index) in playlists" class="relative h-auto min-h-[7rem] w-full p-3.5 sm:p-5 mb-4 sm:mb-6 rounded-lg shadow cursor-pointer bg-white border border-gray-200" @click="searchUrl(playlist.id)" :key="playlist.id">
                
                <a :href="playlistUrl(playlist.id)" rel="noopener" target="_blank" class="break-words text-gray-800 hover:underline pb-1 font-bold" @click.stop title="YouTube Playlist">
                    {{playlist.snippet.title}}
                </a>

                <!-- <p class="text-sm">Created on {{(playlist.snippet.publishedAt).substring(0,10)}}</p> -->
                <p class="text-sm italic mb-2">{{playlist.contentDetails.itemCount}} videos</p>
                <SearchResultChannel :channelName="playlist.snippet.channelTitle" :channelUrl="'https://www.youtube.com/channel/' + playlist.snippet.channelId" />
                <p class="text-sm mt-2">{{playlist.snippet.description}}</p>

                <button @click.stop="deletePlaylist(playlist.id, index)" class="absolute bottom-5 right-5 mx-1 rounded-full p-2 shadow md:shadow-lg border bg-white hover:bg-gray-200" title="Delete Playlist" >
                    <img class="h-5 sm:h-6" src="@/assets/icons/trash-solid.svg" alt="Delete">
                </button>
            </div>

            <div v-if="playlistsLoaded && !playlists.length" class="flex flex-col flex-grow justify-center items-center">
                <p class="text-7xl my-8">🧐</p>
                <p>No playlists found..</p>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { playlistInstance, videoInstance } from '../helpers/db'
import SearchResultChannel from '@/components/SearchResultChannel.vue'

export default defineComponent({
    name: 'Playlists',
    components: { SearchResultChannel },
    async setup() {
        const playlistDb = await playlistInstance()
        const videoDb = await videoInstance()

        return { playlistDb, videoDb}
    },
    data() {
        return {
            playlists: new Array<Playlist>(),
            playlistsLoaded: false,
        }
    },
    created () {
        this.playlistDb.iterate( (data: any, playlistId, iterationNumber) => {
            this.playlists.push(data?.playlist as Playlist)
        }).then(() => {
            this.playlistsLoaded = true
        })
    },
    methods: {
        confirmDeletePlaylist() {
            // TODO
        },
        async deletePlaylist (playlistId : string, index: number) {
            let playlistData = await this.playlistDb.getItem(playlistId)

            playlistData.playlistItems.forEach((playlistItem : PlaylistItem) => {
                this.videoDb.removeItem(playlistItem.contentDetails.videoId)
            })

            this.playlistDb.removeItem(playlistId).then(() => {
                this.playlists.splice(index, 1)
            })
        },
        playlistUrl (playlistId : string) : string {
            return 'https://www.youtube.com/playlist?list=' + playlistId
        },
        searchUrl(playlistId : string) {
            this.$router.push(
                {
                    path: 'search',
                    query: {
                        url: this.playlistUrl(playlistId),
                        // refreshPlaylist : 'true'
                    }
                }
            )
        }
    }
})
</script>
