<template>
    <main class="flex flex-col flex-grow items-center px-4 md:px-8 py-3">
        <div class="flex flex-col flex-grow max-w-2xl px-3 py-4 sm:py-8">
            <h1 class="text-xl md:text-2xl font-semibold my-2 md:my-3">Playlists</h1>
            <p class="text-sm mb-7">The Playlists you search for are saved offline in your browser automatically. You can see all of them here to manage them better.</p>
            
            <div v-for="(playlist, index) in playlists" class="relative h-auto min-h-[7rem] w-full p-3.5 sm:p-5 mb-4 sm:mb-6 rounded-lg shadow cursor-pointer bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600" @click="searchUrl(playlist.id)" :key="playlist.id">
                
                <a :href="playlistUrl(playlist.id)" rel="noopener" target="_blank" class="break-words text-gray-800 dark:text-gray-100 hover:underline pb-1 font-bold" @click.stop title="YouTube Playlist">
                    {{playlist.snippet.title}}
                </a>

                <!-- <p class="text-sm">Created on {{(playlist.snippet.publishedAt).substring(0,10)}}</p> -->
                <p class="text-sm italic mb-2">{{playlist.contentDetails.itemCount}} videos</p>

                <SearchResultChannel :channelName="playlist.snippet.channelTitle" :channelUrl="'https://www.youtube.com/channel/' + playlist.snippet.channelId" />

                <p class="text-sm mt-2">{{playlist.snippet.description}}</p>

                <button @click.stop="confirmDeletePlaylist(playlist.id, playlist.snippet.title, index)" class="absolute bottom-5 right-5 mx-1 rounded-full p-2 shadow md:shadow-lg border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900" title="Delete Playlist" >
                    <icon class="h-5 sm:h-6" name="trash-solid" alt="Delete"/>
                </button>
            </div>

            <div v-if="playlistsLoaded && !playlists.length" class="flex flex-col flex-grow justify-center items-center">
                <span class="text-7xl my-8">🧐</span>
                <p>No playlists found..</p>
            </div>

            <Teleport to="body">
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="deletePlaylistModal" @click.self="deletePlaylistModal = false" class="grid place-items-center h-full w-full fixed top-0 left-0 bg-blue-gray-300 bg-opacity-60">
                        <div class="flex flex-col p-4 mx-4 h-auto w-auto sm:max-w-md rounded-lg bg-white dark:bg-gray-800 dark:text-white">
                            <h3 class="text-lg font-bold text-center my-2">Delete Playlist?</h3>
                            <div class="mx-2">

                                <div class="flex flex-row text-center place-items-center mx-3 my-10 sm:mx-5 sm:my-14">
                                    <p class="font-semibold italic line-clamp-3 break-words w-2/4">{{deletePlaylistName}}</p>
                                    <span class="text-xl sm:text-2xl w-1/4">=></span>
                                    <span class="text-4xl sm:text-5xl w-1/4">🗑️</span>
                                </div>
                                <p class="text-sm mb-6 text-gray-800 dark:text-gray-200">Are you sure you want to delete the playlist? This will also remove video details related to the playlist stored offline on your device.</p>
                                <p class="text-xs text-gray-400 italic">Side effects may include a star exploding somewhere in the Universe. I hold no responsibility if this occurs.</p>
                            </div>

                            <div class="flex flex-row justify-center mt-5 mb-3 space-x-9">
                                <button @click="deletePlaylistModal = false" class="px-4 py-1 rounded-full border shadow-sm hover:bg-gray-100 dark:hover:bg-gray-900">Cancel</button>
                                <button @click="deletePlaylist()" class="px-4 py-1 rounded-full border shadow-sm bg-red-600 text-white font-semibold hover:bg-red-700">Delete</button>
                            </div>

                        </div>
                    </div>
                </transition>
            </Teleport>

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
            deletePlaylistModal: false,
            deletePlaylistId: '',
            deletePlaylistName: '',
            deletePlaylistIndex: 999,
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

        confirmDeletePlaylist(playlistId : string, playlistName: string, index: number) {
            this.deletePlaylistModal = true
            this.deletePlaylistId = playlistId
            this.deletePlaylistName = playlistName
            this.deletePlaylistIndex = index
        },

        async deletePlaylist() {
            let playlistData : any = await this.playlistDb.getItem(this.deletePlaylistId)

            playlistData.playlistItems.forEach((playlistItem : PlaylistItem) => {
                this.videoDb.removeItem(playlistItem.contentDetails.videoId)
            })

            this.playlistDb.removeItem(this.deletePlaylistId).then(() => {
                this.playlists.splice(this.deletePlaylistIndex, 1)
            })

            this.deletePlaylistModal = false
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
