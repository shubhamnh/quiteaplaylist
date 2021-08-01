<template>
    <div class="flex flex-col flex-grow px-4 md:px-8 py-5 text-center">
        <SearchBar ref="search" class="flex flex-col"
            @processPlaylist="processPlaylist($event)"
            @processVideo="processVideo($event)"
            @resetVidDetails="resetVidDetails()"
            @setSearchStatus="setSearchStatus($event)"
            @setMode="setMode($event)"
            :searchUrl="searchUrl"
        />
        <div v-if="searchStatus === 102" class="flex flex-col flex-grow items-center justify-center">
            <div class="multi-ripple h-28 w-28">
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-else-if="searchStatus === 204" class="flex flex-col flex-grow items-center justify-center">
            <p>Looks like you're having a lucky day!<br>All your playlist videos are visible!</p>
        </div>
        <div v-else-if="searchStatus === 206" class="flex flex-col flex-grow items-center justify-center">
            <p>Looks like your playlist is empty!<br>Coudn't find any videos in there!</p>
        </div>
        <div v-else-if="searchStatus === 404" class="flex flex-col flex-grow items-center justify-center">
            <p>Could not find the Playlist mentioned.<br>Make sure the playlist is public or unlisted and try again!</p>
        </div>
        <div v-else-if="searchStatus === 500" class="flex flex-col flex-grow items-center justify-center">
            <p>Error getting playlist details :(<br>Bug me on Twitter!</p>
        </div>
        <div v-if="searchStatus === 200 && searchMode === 'playlist'" class="flex flex-row justify-between items-center pt-2 pb-4">
            <div class="w-2/3 text-left">
                <p class="text-base lg:text-lg line-clamp-2"> {{playlistName}} </p>
                <p class="text-sm lg:text-base">Found {{foundCount}} of {{vidDetails.length}}</p>
            </div>
            <div class="w-1/3 place-self-end">
                <div class="relative inline-block text-left">
                    <div>
                        <button type="button" @click="toggleMenu()" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-magenta-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                        {{ viewModes[activeViewMode] }}
                        <!-- Heroicon name: solid/chevron-down -->
                        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        </button>

                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <div v-show="menuMode" ref="dropdown" @blur="menuMode = false" class="origin-top-right absolute right-0 mt-2 w-28 lg:w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                                <div v-for="(viewMode, index) in viewModes" :key="index" class="py-1">
                                    <button @click="activeViewMode = index; menuMode = false" class="w-full text-gray-700 block px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        {{ viewMode }}
                                    </button>
                                </div>
                            </div>
                        </transition>
                    </div>


                </div>

            </div>
        </div>
        <!-- <div class="flex flex-row flex-wrap place-content-around"> -->
        <div class="grid gap-5 grid-cols-1 md:gap-8 md:py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <VideoDetails v-for="vidDetail in vidDetails" :vidDetail="vidDetail" :activeViewMode="activeViewMode" :searchMode="searchMode" :key="vidDetail.id"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchBar from "@/components/SearchBar.vue"
import VideoDetails from "@/components/VideoDetails.vue"

export default defineComponent({
    name: 'Search',
    components: { SearchBar, VideoDetails },
    props: {
        url : String
    },
    data () {
        return {
            vidDetails : new Array<VideoDetails>(),
            playlistName : '',
            searchUrl : '',
            activeViewMode : 0,
            viewModes: ['All','Found','Gems 💎'],
            foundCount : 0,
            searchMode: '',
            menuMode: false,
            searchStatus: 0,
            // 0 notTriggered
            // 102 Running / Loading
            // 200 Playlists Fetched
            // 206 Partial Content - No Removed Video Found
            // 204 NoContent - Empty Playlist
            // 404 Playlist not found
            // 500 Internal Server Error = Server Error - YT API Cloudflare (TODO: Elaborate errors)

            ytPrefix: 'https://www.youtube.com/',
            ytVidPrefix: 'https://www.youtube.com/watch?v=',
            
            cdx: 'http://web.archive.org/cdx/search/cdx?url=',
            // cdxSuffix: '&output=json&filter=statuscode:200&limit=5&collapse=timestamp:8', //
            cdxSuffix: '&output=json&filter=statuscode:200&limit=20&from=201004&collapse=timestamp:7', // 
            
            // Help : https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine
            waybackPrefix: 'https://web.archive.org/web/',
            waybackOpt: 'id_/', // id_ (original links) or if_ (wayback archive links)
            wbCorsProxy: 'https://wb.shubhamnh.workers.dev/?',

            ytPApi: 'https://youtube.googleapis.com/youtube/v3/playlists?',
            ytPApiPart: 'part=snippet%2CcontentDetails%2Cstatus',
            ytPApiId: '&id=',

            ytPIApi: 'https://youtube.googleapis.com/youtube/v3/playlistItems?',
            ytPIApiPart: 'part=contentDetails%2C%20status%2C%20id%2C%20snippet',
            ytPIApiMax: '&maxResults=50', // 0 - 50
            ytPIApiId:'&playlistId=',
            ytPIApiPg: '&pageToken=',
            ytApiKey: '&key=',
            ytCorsProxy: 'https://yt-recover.shubhamnh.workers.dev/?',
        }
    },
    created () {
        // From Home / Created first time
        if(this.$route.query.url) {
            console.log('Created: '+this.$route.query.url)
            this.searchUrl = (this.$route.query?.url)?.toString() || ''
        }
    },
    watch: {
        // Watch URL on Search page
        $route(to,from) {
            this.searchUrl = (to.query?.url)?.toString() || ''
        }
    },
    methods: {

        async processPlaylist(plId: string) {
            let playlistres, nextPageToken = ''
            let plItems = []
            let absentVideos = []
            let url, status : VideoDetails["status"]
            let delCount = 0

            // Get Playlist Name
            if (import.meta.env.PROD) {
                playlistres =  await fetch(this.ytCorsProxy + this.ytPApi + this.ytPApiPart + this.ytPApiId + plId)
            } else {
                playlistres =  await fetch(this.ytPApi + this.ytPApiPart + this.ytPApiId + plId + this.ytApiKey + import.meta.env.VITE_YT_API_KEY)
            }

            if (playlistres.status !== 200) {
                this.setSearchStatus(500)
                return
            } else {
                const playlistList : PlaylistList = await playlistres.json()
                if (playlistList.items[0]) {
                    this.setPlaylist(playlistList.items[0])
                } else {
                    this.setSearchStatus(404)
                    return
                }
            }


            // Get all playlist items
            do {
                let { playlistItems, nPageToken } = await this.getPlPageItems(plId, nextPageToken)
                if (playlistItems === undefined) {
                    return
                }
                plItems.push(...playlistItems)
                nextPageToken = nPageToken
            } while (nextPageToken)

            this.setSearchStatus(200)
            // console.log(plItems)

            if (plItems.length) {

                // get deleted/private videos
                for (const playlistItem of plItems) {

                    // Skip Public and Unlisted Videos
                    if (playlistItem.status.privacyStatus === 'public' || playlistItem.status.privacyStatus === 'unlisted') {
                        continue
                    }

                    // Consider 'private' and 'privacyStatusUnspecified' (deleted) videos
                    // Create sequential empty video details
                    url = this.ytVidPrefix + playlistItem.contentDetails.videoId
                    status = playlistItem.status.privacyStatus === 'private' ? 'Private' : 'Deleted'
                    this.addToVidDetails(this.VideoDetails(delCount, 0, url, status, playlistItem.snippet.position + 1))

                    absentVideos.push(playlistItem)
                    delCount++
                }

                console.log(absentVideos)

                if (absentVideos.length) {
                    // Get and process Snapshots of Videos
                    for (const [index, playlistItem] of absentVideos.entries()) {
                        url = this.ytVidPrefix + playlistItem.contentDetails.videoId
                        this.getAndProcessPlaylistSnapshots(url, index)
                    }
                } else {
                    this.setSearchStatus(204)
                }   
                
            } else {
                this.setSearchStatus(206)
            }
        },

        async getPlPageItems (plId: string, nextPageToken ?: string) {
            let res
            const nextPageUrl = this.ytPIApi + this.ytPIApiPart + this.ytPIApiMax + this.ytPIApiId + plId + this.ytPIApiPg + nextPageToken

            if (import.meta.env.PROD) {
                res = await fetch(this.ytCorsProxy + nextPageUrl)
            } else {
                res = await fetch(nextPageUrl + this.ytApiKey + import.meta.env.VITE_YT_API_KEY)
            }

            if (res.status !== 200) {
                if (res.status === 404) {
                    this.setSearchStatus(404)
                }
                else {
                    this.setSearchStatus(500)
                }
                return { undefined }
            }
            
            const resjson = await res.json()
            const playlistItems : PlaylistItem[] = resjson.items
            const nPageToken = resjson.nextPageToken

            return { playlistItems, nPageToken }
        },

        async getAndProcessPlaylistSnapshots (url : string, index : number) {
            const snapshots : UrlSnapshot[] = await this.getSnapshots(url)
            // TODO : Remove assigning from processSnapshots
            // Object.assign(vidDetail, {snapshots : snapshots.length})
            this.processSnapshots(snapshots, index)
        },

        async processVideo(vidId: string) {
            const vidUrl = this.ytVidPrefix + vidId
            const snapshots = await this.getSnapshots(vidUrl)
            this.setSearchStatus(200)
            this.addToVidDetails(this.VideoDetails(0, 0, vidUrl))
            this.processSnapshots(snapshots)
        },

        async getSnapshots (url:string) : Promise<UrlSnapshot[]> {
            let res

            if (import.meta.env.PROD) {
                res = await fetch(this.wbCorsProxy + this.cdx + url + this.cdxSuffix)
            } else {
                res = await fetch(this.cdx + url + this.cdxSuffix)
            }
            // console.log(res)

            // TODO: Set error inside video card
            if (res.status !== 200) {
                // this.setSearchError('Error fetching details from Wayback m/c. Try again?')
                return []
            }
            const snapshots = await res.json()
            // Remove first format object
            snapshots.shift()

            const urlSnapshots : UrlSnapshot[] = new Array<UrlSnapshot>()
            snapshots.forEach( (snapshot : string[]) => {
                urlSnapshots.push({ 
                    urlKey: snapshot[0], 
                    timestamp: snapshot[1], 
                    original: snapshot[2], 
                    mimeType: snapshot[3], 
                    statusCode: snapshot[4], 
                    digest: snapshot[5], 
                    length: snapshot[6]
                 } as UrlSnapshot)
            });

            return urlSnapshots
        },

        async processSnapshots (snapshots : UrlSnapshot[], index = 0) {
             // TODO: Search Engine search refactor
             // No data found on Wayback
            if ((snapshots === undefined) || (!snapshots.length)) {
                // const SEVidDetail = await this.searchEngineSearch(this.vidDetails[index].url)
                // if (SEVidDetail.searchStatus === 200) {
                //     Object.assign(SEVidDetail, {snapshots : snapshots.length})
                //     this.assignToVidDetails({index : index, vidData: SEVidDetail})
                // } else {
                //     this.assignToVidDetails({index : index, vidData: {searchStatus: 404, title: 'No data found', snapshots: 0}})
                // }

                this.assignToVidDetails({index : index, vidData: {searchStatus: 404, title: 'No data found', snapshots: 0}})
            } else {

                for (const [i, snapshot] of snapshots.entries()) {
                    const vidDetail = await this.extractVideoDetails(snapshot)

                    // Found details of a video OR Last snapshot
                    if (vidDetail.searchStatus === 200) {
                        Object.assign(vidDetail, {snapshots : snapshots.length})
                        this.assignToVidDetails({index : index, vidData: vidDetail})
                        break
                    } else if (i === (snapshots.length - 1)) {
                        // TODO : Saving details if Title only found in previous snapshots

                        // const SEVidDetail = await this.searchEngineSearch(this.vidDetails[index].url)
                        // if (SEVidDetail.searchStatus === 200) {
                        //     Object.assign(SEVidDetail, {snapshots : snapshots.length})
                        //     this.assignToVidDetails({index : index, vidData: SEVidDetail})
                        // } else {
                        //     Object.assign(vidDetail, {snapshots : snapshots.length})
                        //     this.assignToVidDetails({index : index, vidData: vidDetail})
                        // }

                        Object.assign(vidDetail, {snapshots : snapshots.length})
                        this.assignToVidDetails({index : index, vidData: vidDetail})
                    }
                }
            }
        },

        async extractVideoDetails(snapshot: UrlSnapshot) : Promise<any> {
            let waybackUrl, waybackFetchUrl

            // TODO: Snapshot timestamp when redirects (302)
            const snapTime = Number(snapshot.timestamp)
            const snapDate = snapshot.timestamp.slice(6,8) + '/' + snapshot.timestamp.slice(4,6) + '/' + snapshot.timestamp.slice(0,4)

            waybackUrl = this.waybackPrefix + snapshot.timestamp + this.waybackOpt + snapshot.original
            
            if (import.meta.env.PROD) {
                waybackFetchUrl = this.wbCorsProxy + waybackUrl
            } else {
                waybackFetchUrl = waybackUrl
            }

            const res = await fetch(waybackFetchUrl)

            // Error getting single snapshot from wayback
            if (res.status !== 200) {
                let searchStatus : VideoDetails["searchStatus"]
                let title

                if (res.status === 503) {
                    console.error('Wayback Machine seems to be down! Check Twitter!')
                    title = `Wayback Machine seems to be down.<br>Please check <a href="https://twitter.com/internetarchive/">Twitter</a> if there's any downtime.`
                    searchStatus = 503
                    
                } else if (res.status === 404) {
                    title = 'No Details Found for this snapshot'
                    searchStatus = 404
                } else {
                    title = 'A problem occured while getting details. Reach out to me if this persists!'
                    searchStatus = 500
                }
                
                return {
                    searchStatus: searchStatus,
                    title: title,
                    snapshotTime: snapDate,
                    waybackUrl: waybackUrl
                }
            }

            let title, channelName, channelUrl, description, published, duration
            const rawhtml = await res.text()
            const parser = new DOMParser()
            const parsedhtml = parser.parseFromString(rawhtml, 'text/html')
            

            // English Publish date only
            // console.log(parsedhtml.querySelector('html')?.getAttribute('lang'))
            // if (parsedhtml.querySelector('html')?.getAttribute('lang') !== 'en')
            //     return {
            //         searchStatus: 404,
            //         title: 'Language not English',
            //         snapshotTime: snapDate,
            //         waybackUrl: waybackUrl
            //     }

            // if (snapTime < 20100400000000) {
            //     channelName = parsedhtml.querySelector('.contributor')?.innerHTML
            //     channelUrl = parsedhtml.querySelector('.contributor')?.getAttribute('href')
            // }

            if (snapTime < 20100700000000) {
                title = parsedhtml.querySelector('#watch-headline-title > span')?.getAttribute('title')
                channelName = parsedhtml.querySelector('#watch-username > strong:nth-child(1)')?.innerHTML
                if (!channelName) {
                    channelName = parsedhtml.querySelector('.watch-description-username > strong:nth-child(1)')?.innerHTML
                    channelUrl = parsedhtml.querySelector('.watch-description-username')?.getAttribute('href')
                } else {
                    channelUrl = parsedhtml.querySelector('#watch-username')?.getAttribute('href')
                }
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#watch-description-body > span:nth-child(4)')?.innerHTML || ''
                published = parsedhtml.querySelector('.watch-video-date')?.innerHTML.trim()

            } else if (snapTime < 20110300000000) {
                title = parsedhtml.querySelector('#eow-title')?.getAttribute('title')
                channelName = parsedhtml.querySelector('#watch-username > strong:nth-child(1)')?.innerHTML
                if (!channelName) {
                    channelName = parsedhtml.querySelector('.watch-description-username > strong:nth-child(1)')?.innerHTML
                    channelUrl = parsedhtml.querySelector('.watch-description-username')?.getAttribute('href')
                } else {
                    channelUrl = parsedhtml.querySelector('#watch-username')?.getAttribute('href')
                }
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#eow-description')?.innerHTML || ''
                published = parsedhtml.querySelector('.watch-video-date')?.innerHTML.trim()

            } else if (snapTime < 20130100000000) {
                title = parsedhtml.querySelector('#eow-title')?.getAttribute('title')
                channelName = parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.innerHTML || ''
                channelUrl = parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.getAttribute('href')
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#eow-description')?.innerHTML || ''
                published = parsedhtml.querySelector('.watch-video-date')?.innerHTML.trim()

            } else if (snapTime < 20140700000000) {
                title = parsedhtml.querySelector('#eow-title')?.getAttribute('title') || parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title') || ''
                channelName = parsedhtml.querySelector('#watch7-user-header .yt-user-name')?.innerHTML
                channelUrl = parsedhtml.querySelector('#watch7-user-header .yt-user-name')?.getAttribute('href')
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#eow-description')?.innerHTML || ''
                published = parsedhtml.querySelector('.watch-video-date')?.innerHTML || parsedhtml.querySelector('#watch-uploader-info')?.textContent?.trim()

            } else if (snapTime < 20200702000000) {
                title = parsedhtml.querySelector('#eow-title')?.getAttribute('title')
                channelName = parsedhtml.querySelector('.yt-user-info > a:nth-child(1)')?.innerHTML
                channelUrl = parsedhtml.querySelector('.yt-user-info > a:nth-child(1)')?.getAttribute('href')
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#eow-description')?.innerHTML || ''
                published = parsedhtml.querySelector('#watch-uploader-info')?.firstElementChild?.innerHTML || ''

            } else {
                const window_regex = /\bwindow\["ytInitialPlayerResponse"\]\s*=\s*(\{.*?\})\s*;/
                const var_regex = /\bvar\s*ytInitialPlayerResponse\s*=\s*(\{.*?\})\s*;\s*/
                const extract = rawhtml.match(window_regex)? rawhtml.match(window_regex) : rawhtml.match(var_regex)
                let videoMeta

                // No match for regex
                if (extract !== null && extract !== undefined && extract.length !== 0) {
                    videoMeta = JSON.parse(extract[1])
                    // console.log(extract)
                    // console.log(videoMeta)
                    // console.log(videoMeta.microformat)

                    // Deleted video snapshot in Wayback
                    if (videoMeta.microformat === undefined) {
                        const reason : string = this.getReason(videoMeta)
                        
                        console.log(reason)
                        return {
                            searchStatus: 206,
                            title: reason,
                            snapshotTime: snapDate,
                            waybackUrl: waybackUrl
                        }
                    }
                } else {
                    return {
                        searchStatus: 204,
                        title: 'Could not find details, Player Response not found',
                        snapshotTime: snapDate,
                        waybackUrl: waybackUrl
                    }
                }

                title = videoMeta.microformat.playerMicroformatRenderer.title.simpleText
                channelName = videoMeta.microformat.playerMicroformatRenderer.ownerChannelName
                channelUrl = videoMeta.microformat.playerMicroformatRenderer.ownerProfileUrl
                description = videoMeta.microformat.playerMicroformatRenderer.description ? videoMeta.microformat.playerMicroformatRenderer.description.simpleText : ''
                published = videoMeta.microformat.playerMicroformatRenderer.publishDate
                duration = this.formatDuration(videoMeta.microformat.playerMicroformatRenderer.lengthSeconds)

            }

            // TODO : Check if undefined getting returned
            return {
                searchStatus: (title && channelName) ? 200 : 404,
                title: title || 'Could not find details',
                channelName: channelName,
                snapshotTime: snapDate,
                channelUrl: channelUrl,
                description: description,
                published: published,
                waybackUrl: waybackUrl,
                duration: duration
            }
        },

        async searchEngineSearch(url: string) {
            // Avoid Brave Response denied
            const res = await fetch('https://search.brave.com/search?q='+url.replace('https://www.',''))

            if (res.status !== 200) {
                return {
                    searchStatus: res.status,
                }
            }

            const rawhtml = await res.text()
            const parser = new DOMParser()
            const parsedhtml = parser.parseFromString(rawhtml, 'text/html')
            

            const searchResultUrl = parsedhtml.querySelector('.result-header')?.getAttribute('href')
            if (searchResultUrl === url) {
                const title = parsedhtml.querySelector('.snippet-title')?.textContent?.replace(' - YouTube', '')
                return {
                    title : title,
                    searchStatus : 200
                }
            }
            return {
                searchStatus : 304
            }
            
        },

        getReason(videoMeta : any) : string {       
            if (videoMeta.playabilityStatus.errorScreen) {
                const errorMessage = videoMeta.playabilityStatus.errorScreen.playerErrorMessageRenderer
                if (errorMessage.subreason) {
                    if (errorMessage.subreason.runs) {
                        console.log(errorMessage.subreason.runs.entries())
                        let runText = ''
                        for (const obj of errorMessage.subreason.runs){
                            console.log(obj.text)
                            runText += obj.text
                        }
                        return runText
                    } else if (errorMessage.subreason.simpleText) {
                        return errorMessage.subreason.simpleText
                    }

                } else if ( errorMessage.reason.simpleText ) {
                    return errorMessage.reason.simpleText
                }
            }
            return 'Error getting Video Details' 
        },

        formatDuration(time : number) : string {   
                // Hours, minutes and seconds
                const hrs = ~~(time / 3600)
                const mins = ~~((time % 3600) / 60)
                const secs = ~~time % 60

                // Output like "1:01" or "4:03:59" or "123:03:59"
                let ret = ''
                if (hrs > 0) {
                        ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
                }
                ret += '' + mins + ':' + (secs < 10 ? '0' : '')
                ret += '' + secs
                return ret
        },

        VideoDetails: (
            id: number,
            searchStatus : VideoDetails["searchStatus"],
            url : string,
            status?: VideoDetails["status"],
            playlistPosition ?: number,
            title?: string,
            snapshotTime?: string,
            channelName?: string,
            channelUrl?: string,
            description?: string,
            published?: string,
            waybackUrl?: string,
            duration?: string) : VideoDetails => {
            return {
                id: id,
                searchStatus : searchStatus,
                url : url,
                title: title,
                channelName: channelName,
                channelUrl: channelUrl,
                description: description,
                published: published,
                duration: duration,
                status: status,
                waybackUrl: waybackUrl,
                snapshotTime: snapshotTime,
                playlistPosition: playlistPosition
            } as VideoDetails
        },

        resetVidDetails() {
            this.vidDetails = new Array<VideoDetails>()
            this.playlistName = ''
            this.foundCount = 0
            this.activeViewMode = 0
        },
        addToVidDetails (vidDetail: VideoDetails) {
            this.vidDetails.push(vidDetail)
        },
        assignToVidDetails ({index, vidData} : {index:number, vidData: any}) {
            Object.assign( this.vidDetails[index] , vidData)
            if (vidData.searchStatus && vidData.searchStatus === 200)
                this.foundCount++
        },
        setPlaylist (playlist: Playlist) {
            this.playlistName = playlist.snippet.title
        },
        setSearchStatus (status : number) {
            this.searchStatus = status
        },
        setMode (mode : '' | 'video' | 'playlist') {
            this.searchMode = mode
        },
        toggleMenu () {
            // if(!this.menuMode) {
            //     this.$refs.dropdown.focus()
            // }
            this.menuMode = !this.menuMode
        }
    },
})
</script>
