<template>
    <main class="flex flex-col flex-grow justify-center items-center px-4 md:px-8 py-3 text-left">
        
        <article class="max-w-2xl px-3 py-4 sm:py-8 space-y-3">
        
            <h1 class="text-xl md:text-2xl font-semibold my-3 md:my-5">Find Deleted & Private YouTube videos from Playlists</h1>

            <p>If you make playlists on YouTube to save your favorite music or cat videos or for learning stuff, there must have been a time when you find that a video from playlist goes missing. It gets deleted or is made private. Many of these videos get taken down by YouTube on copyright grounds or if they have something controversial. Sometimes the uploader themselves decide to make it private or remove it.</p>
            <p>The following guide shows how to recover / find details of these videos. </p>
            <ol class="list-decimal list-outside space-y-3 pl-6">
                <li><p>Open the playlist on YouTube which has deleted videos.</p></li>

                <li class="space-y-3"><p>Make sure the Playlist is either Public <icon class="inline align-text-top h-5 w-5" name="globe" alt="Public"/> or Unlisted <icon class="inline align-text-top h-5 w-5" name="unlisted" alt="Unlisted"/> if it's your own playlist. You can find this by looking at the icon next to your playlist name. Please note that this method won't work for the "Liked" Playlist which has all your Liked Videos as well as for the "Watch Later" playlist. More info <a href="#liked-watch-later" class="italic hover:underline">here</a>.</p>

                    <p>If your playlist is Private <icon class="inline align-text-top h-5 w-5" name="lock-closed-outline" alt="Private"/>, you can change the privacy settings of the playlist using the Edit
                            <icon class="inline align-text-top h-5 w-5" name="pencil" alt="Edit"/>
                            icon.
                    </p>

                    <GuideImage :src="privacyImage" caption="Set Playlist Privacy"/>

                    <p>This site doesn't log any info about your playlists. However, it does store your playlists and video info in your browser for better performance.</p>
                </li>

                <li><p>Tap on the share icon as highlighted below..</p>
                    <GuideImage :src="shareImage" caption="Share Playlist"/>
                </li>
                <li><p>Copy the link to the clipboard as highlighted. The option text and icon may be different depending on your device.</p>

                    <GuideImage :src="copyImage" caption="Copy to Clipboard"/>
                </li>
                <li><p>Go to the <router-link to="/" title="Home" class="italic hover:underline">home</router-link> page, paste the URL/link in the search box and hit enter!</p>

                    <GuideImage class="max-w-xs" :src="homepagePaste" caption="Paste Link in Search bar"/>
                </li>
                <li class="space-y-3"><p>The site will get the video/playlist details. The probability of finding the video details usually depends on the popularity of the video. If it can’t find any details for a video, you can search for it on a search engine or social media like Twitter to find the name of the video.</p>

                    <p>Only the videos which have been deleted or made private are shown in the results. You can see the position of the video in the playlist in the top left corner.</p>

                    <!-- <GuideImage class="max-w-lg" :src="results" caption="Search results"/> -->
                    <GuideImage class="max-w-xs" :src="results1" caption="Search results"/>
                    <!-- <GuideImage :src="results2" caption="Search results"/> -->
                </li>
                <li><p>For videos which it can find, you can see video details like title, description, channel details, etc. You can then search for similar videos on YouTube by pressing the search button.</p>

                    <GuideImage class="max-w-xs" :src="videoDetails" caption="Deleted video details"/>
                </li>
                <li><p>If the details has been sourced from archive.org / Wayback Machine like the one showed above, there is a chance that they have the video archived as well. You can click on the source link and see if that’s the case.</p>

                    <p>The video which we found above has been stored and as we can see below, we're able to watch the deleted YouTube video on the archived page.</p>

                    <GuideImage :src="watchVideo" caption="Watch deleted YouTube video"/>
                </li>
            </ol>

            <p>You can get the playlist URL in a similar way if you're using a browser, or just copy the link from the URL/address bar.</p>

            <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Something to keep in mind...</h2>
            <p>The data shown from Internet Archive snapshots will not necessarily be the same as when the video was made private or deleted. This site tries to get data from the earliest snapshots possible and there is a chance that the video details like title and description have been changed since the snapshot was taken.</p>

            <h2 id="url-accepted" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Links (URLs) accepted</h2>
            <p>The app accepts links of Playlists as well as Videos. Below is a non exhaustive list of examples.</p>

            <p>
                Playlist links:
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
            <h2 id="liked-watch-later" class="text-lg font-semibold md:text-xl pt-5 md:pt-7 active:bg-orange-vivid-300"> Liked & Watch Later Playlists </h2>
            <p>Liked and Watch Later Playlists are private by default and cannot be made public. If you have any videos you want to search for in those, you can manually copy the Video URL by opening it in the browser (mobile app doesn't give us this option) and search on this site.</p>
        </article>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GuideImage from "../components/GuideImage.vue"
import privacyImage from '@/assets/images/playlist-privacy.jpg'
import shareImage from '@/assets/images/share-playlist-url.jpg'
import copyImage from '@/assets/images/copy-link.jpg'
import homepagePaste from '@/assets/images/paste-link-homepage.jpg'
import results1 from '@/assets/images/youtube-playlist-deleted-videos.jpg'
import results2 from '@/assets/images/youtube-playlist-private-videos.jpg'
import results from '@/assets/images/youtube-playlist-deleted-private-videos.jpg'
import videoDetails from '@/assets/images/deleted-video-details.jpg'
import watchVideo from '@/assets/images/watch-deleted-video-wayback.jpg'

export default defineComponent({
    name: 'Guide',
    components: { GuideImage },
    // metaInfo: {
    //   title: 'Finding Deleted or Private YouTube video details from Playlists Guide',
    //   htmlAttrs: {
    //     lang: 'en',
    //   }
    // }
    data () {
        return {
            privacyImage: privacyImage,
            shareImage: shareImage,
            copyImage: copyImage,
            homepagePaste: homepagePaste,
            results: results,
            results1: results1,
            results2: results2,
            videoDetails: videoDetails,
            watchVideo: watchVideo
        }
    }
})
</script>