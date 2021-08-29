<template>
    <div class="flex flex-col flex-grow justify-center items-center px-4 md:px-8 py-3 text-left">
        
        <div class="max-w-2xl px-3 py-4 sm:py-8 space-y-2">
        
            <h1 class="text-xl md:text-2xl font-semibold my-3 md:my-5">Find Deleted & Private YouTube videos from Playlists</h1>

            <p>If you make playlists on YouTube to save your favorite music or cat videos or for learning stuff, there must have been a time when you find that a video from playlist goes missing. It gets deleted or is made private. Many of these videos get taken down by YouTube on copyright grounds or if they have something controversial. Sometimes the uploader themselves decide to make it private or remove it.</p>
            <p>The following guide shows how to recover / find details of these videos. </p>
            <ol class="list-decimal list-outside space-y-3 pl-6">
                <li>Open the playlist on YouTube which has deleted videos.</li>

                <li>Make sure the Playlist is either Public <img class="inline align-text-top h-5 w-5" src="@/assets/icons/globe.svg" alt="Public"> or Unlisted <img class="inline align-text-top h-5 w-5" src="@/assets/icons/unlisted.svg" alt="Unlisted"> if it's your own playlist. You can find this by looking at the icon next to your playlist name. Please note that this method won't work for the "Liked" Playlist which has all your Liked Videos as well as for the "Watch Later" playlist. More info <a href="#liked-watch-later" class="italic hover:underline">here</a>.
                    <br><br>
                    If your playlist is Private <img class="inline align-text-top h-5 w-5" src="@/assets/icons/lock-closed.svg" alt="Private">, you can change the privacy settings of the playlist using the Edit
                        <img class="inline align-text-top h-5 w-5" src="@/assets/icons/pencil.svg" alt="Edit"> 
                        icon.
                    <br>
                    <img class="w-3/4 max-w-sm h-auto mx-auto my-5 sm:my-8 rounded-md shadow-lg" src="@/assets/images/playlist-privacy.jpg" alt="Set Playlist Privacy">
                    <br>
                    This site doesn't log any info about your playlists. However, it does store your playlists info in your browser for better performance.
                </li>

                <li>Tap on the share icon as highlighted below..
                    <br>
                    <img class="w-3/4 max-w-sm h-auto mx-auto my-5 sm:my-8 rounded-md shadow-lg" src="@/assets/images/share-playlist-url.jpg" alt="Share Playlist">
                </li>
                <li>Copy the link to the clipboard as highlighted. The option text and icon may be different depending on your device.
                    <br>
                    <img class="w-3/4 max-w-sm h-auto mx-auto my-5 sm:my-8 rounded-md shadow-lg" src="@/assets/images/copy-link.jpg" alt="Copy to Clipboard">
                </li>
                <li>Go to the <router-link to="/" title="Home" class="italic hover:underline">home</router-link> page, paste your URL and hit enter!
                </li>
            </ol>

            <p>You can get the playlist URL in a similar way if you're using a browser, or just copy the link from the URL/address bar.</p>
            <br>

            <h2 class="text-lg font-semibold md:text-xl my-2 md:my-3">Something to keep in mind...</h2>
            <p>The data shown is mostly from the Internet Archive snapshots and it's not necessarily the same as when the video was made private or deleted. This site tries to get data from the earliest snapshots possible and it is possible that the video details like title and description have been changed since the snapshot was taken.</p>

            <p>The motive behind this site is to get an idea of which video was and try to find similar videos.</p>
            <br>
            <h2 class="text-lg font-semibold md:text-xl my-2 md:my-3" id="url-accepted">Links (URLs) accepted</h2>
            <p>The app accepts links of Playlists as well as Videos. Below is a non exhaustive list of examples.</p>

            <p>
                Playlist links:
                <br>
                <ul class="list-disc list-outside space-y-1 pl-6 text-sm sm:text-base">
                    <li>https://youtube.com/playlist?list=<span class="italic font-semibold">playlistId</span></li>
                    <li>https://m.youtube.com/playlist?list=<span class="italic font-semibold">playlistId</span></li>
                </ul>
            </p>
            <p>
                Video links:
                <ul class="list-disc list-outside space-y-1 pl-6 text-sm sm:text-base">
                    <li>https://youtube.com/watch?v=<span class="italic font-semibold">videoId</span></li>
                    <li>https://youtu.be/<span class="italic font-semibold">videoId</span></li>
                    <li>https://youtu.be/<span class="italic font-semibold">videoId</span>?list=playlistId (will be treated as video link)</li>
                </ul>
            </p>
            <br>
            <h2 class="text-lg font-semibold md:text-xl my-2 md:my-3 active:bg-orange-vivid-300" id="liked-watch-later">Liked & Watch Later Playlists</h2>
            <p>Liked and Watch Later Playlists are private by default and cannot be made public. If you have any videos you want to search for in those, you can manually copy the Video URL by opening it in the browser (mobile app doesn't give us this option) and search on this site.</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'Guide',
    // metaInfo: {
    //   title: 'Finding Deleted or Private YouTube video details from Playlists Guide',
    //   htmlAttrs: {
    //     lang: 'en',
    //   }
    // }
})
</script>