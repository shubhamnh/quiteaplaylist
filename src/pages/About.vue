<template>
    <main class="flex flex-col flex-grow justify-center items-center px-4 md:px-8 py-3 text-left">

        <div class="max-w-2xl px-3 py-4 sm:py-8 space-y-3">

            <h1 class="text-xl md:text-2xl font-semibold my-3 md:my-5">How this App came to be..</h1>

            <p>Hello, fellow beings 👋</p>
            
            <p>I often found videos in some of my YouTube playlists that are made private or get deleted. Many of these videos get taken down by YouTube on copyright grounds or if they have something controversial. Sometimes the uploader themselves decide to make it private or remove it.</p>
            
            <p>Since YouTube doesn't give us anything about what the video was or about the uploader, it just left me wondering and guessing what these videos were. After a point, the number of videos that go missing from these playlists just left me annoyed. After all, we save something when we find it valuable and losing it is not a good feeling...</p>
            
             <p>As I couldn't find an easy way to find the details of these videos, I made this site to make it easier to do so. It's mainly powered by the <a href="https://filmot.com/" class="italic font-semibold hover:underline" rel="noopener" target="_blank" title="Filmot.com">Filmot.com</a> &amp; <a href="https://archive.org/" class="italic font-semibold hover:underline" rel="noopener" target="_blank" title="Internet Archive">Internet Archive</a>. And for the gems that it can't find, we can easily search for them through other mediums in the hope that someone has posted it somewhere on the Internet!</p>

             <p>Also, a huge thanks to <span class="font-semibold">Jopik</span> from <a href="https://filmot.com/" class="italic font-semibold hover:underline" rel="noopener" target="_blank" title="Filmot.com">Filmot.com</a> for providing much of the data that powers this site. You can checkout his site to search YouTube videos from the words spoken in them! A neat way to help in learning a new language by listening to native speakers' pronunciation and usage 😄.</p>
             
             <p>Hope you find this site helpful!</p>
             
             <p>Have any feedback or questions?</p>
             <p>Reach out to me via <a class="hover:underline font-semibold" href="mailto:human@quiteaplaylist.com" title="Contact E-mail" target="_blank">Email</a> or <a class="hover:underline font-semibold" href="https://twitter.com/shubham_nh" rel="noopener" target="_blank" title="Twitter">Twitter</a>!</p>
             
             <p>Peace out ✌️,<br/>Shubham</p>
            
             <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Attributions</h2>
             <p>Video data provided by <a href="https://filmot.com/" class="italic font-semibold hover:underline" rel="noopener" target="_blank" title="Filmot.com">Filmot.com</a> &amp; <a href="https://archive.org/" class="italic font-semibold hover:underline" rel="noopener" target="_blank" title="Internet Archive">Internet Archive</a></p>
             <p>Homepage Illustration by <a class="italic font-semibold hover:underline" href="https://icons8.com/illustrations/author/5c07e68d82bcbc0092519bb6" rel="noopener" target="_blank">Icons 8</a> from <a class="italic font-semibold hover:underline" href="https://icons8.com/illustrations" rel="noopener" target="_blank">Ouch!</a></p>
             <p>Diamond Icon by <a class="italic font-semibold hover:underline" href="https://www.freepik.com"  rel="noopener" target="_blank" title="Freepik">Freepik</a> from <a class="italic font-semibold hover:underline" href="https://www.flaticon.com/" rel="noopener" target="_blank" title="Flaticon">flaticon.com</a></p>
             <p>Other icons by <a class="italic font-semibold hover:underline" href="https://heroicons.com/" rel="noopener" target="_blank">Heroicons</a>, <a class="italic font-semibold hover:underline" href="https://icons.getbootstrap.com/" rel="noopener" target="_blank">Bootstrap Icons</a> and <a class="italic font-semibold hover:underline" href="https://iconify.design/" rel="noopener" target="_blank">Iconify Design</a></p>

        </div>

    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'About',
    // metaInfo: {
    //   title: 'About',
    //   htmlAttrs: {
    //     lang: 'en',
    //   }
    // }
})
</script>
