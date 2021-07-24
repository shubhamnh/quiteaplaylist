<template>
    <div>
        <div class="flex flex-row place-content-center my-4">
            <div class="flex flex-row flex-grow items-center justify-between rounded-full bg-white border border-gray-300 focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200 
                text-base text-gray-700 mx-2 leading-8 transition-colors duration-200 ease-in-out max-w-lg">
                <input class="outline-none w-full mx-3"
                    @keyup.enter="detectUrl(inputUrl)"
                    v-model="inputUrl"
                    type="text"
                    placeholder="Enter Playlist or Video URL"
                />

                <span v-if="inputUrl" class="flex items-center rounded-full p-1 mr-1 bg-white">
                    <button class="rounded-full bg-gray-200 p-1 focus:outline-none focus:shadow-outline" @click="resetInputUrl" title="Clear Search">
                        <img src="@/assets/icons/x.svg" alt="Clear">
                    </button>
                </span>
                <!-- <span class="flex items-center">
                    <button class="p-1 focus:outline-none focus:shadow-outline" @click="pasteClipboard">
                        <img src="@/assets/icons/clipboard.svg" alt="Paste">
                    </button>
                </span> -->
            </div>
            
            <button class="rounded-full h-10 w-10 
                bg-white border border-gray-300 focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200" 
                @click="detectUrl(inputUrl)" title="Search">
                    <img src="@/assets/icons/arrow-right.svg" alt="Submit">
            </button>
        </div>

        <div>
            <h2> {{ searchError }} </h2>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VideoDetails from './VideoDetails.vue'

export default defineComponent({
    name: 'Search',
    components: {
        VideoDetails,
    },

    methods: {

        detectUrl(inputUrl : string) {
            const vidRegex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?v=([^&\s]+).*)|(?:v\/(.*))))?)|(?:youtu\.be\/(.*)?))/i
            const plRegex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:playlist\?.*?list=([^&\s]+).*)))?)|(?:youtu\.be\/(.*)?))/i
            const vidIdMatch = inputUrl.match(vidRegex)
            const plIdMatch = inputUrl.match(plRegex)
            let vidId, plId
            this.setSearchError('')
            this.$emit('setMode', '')
            this.$emit('resetVidDetails')

            if (vidIdMatch) {
                if (vidIdMatch[1]) {
                    vidId = vidIdMatch[1]
                } else if (vidIdMatch[2]) {
                    vidId = vidIdMatch[2]
                } else vidId = vidIdMatch[3]
            }

            if (plIdMatch && plIdMatch[1]) {
                plId = plIdMatch[1]
            }

            console.log(vidIdMatch)
            console.log(plIdMatch)
            console.log(vidId, plId)

            if (plId) {
                this.$emit('setSearchStatus', 102)
                this.$emit('setMode', 'playlist')
                this.processPlaylist(plId)
            } else if (vidId && vidId.length === 11) {
                this.$emit('setSearchStatus', 102)
                this.$emit('setMode', 'video')
                this.processVideo(vidId)
            } else {
                this.setSearchError('Could not detect Video or Playlist URL')
            }
        },

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
            const playlistList : PlaylistList = await playlistres.json()
            // TODO : Error handling playlistres not found
            this.$emit('setPlaylist', playlistList.items[0])

            // Get all playlist items
            do {
                let { playlistItems, nPageToken } = await this.getPlPageItems(plId, nextPageToken)
                if (playlistItems === undefined) {
                    // 
                    // this.$emit('setSearchLoading', false)
                    return
                }
                plItems.push(...playlistItems)
                nextPageToken = nPageToken
            } while (nextPageToken)

            this.$emit('setSearchStatus', 200)
            console.log(plItems)

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
                    this.$emit('addToVidDetails', this.VideoDetails(delCount, 0, url, status, playlistItem.snippet.position + 1))

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
                    this.$emit('setSearchStatus', 204)
                }   
                
            } else {
                this.$emit('setSearchStatus', 206)
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
                    this.$emit('setSearchStatus', 404)
                }
                else {
                    this.$emit('setSearchStatus', 500)
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
            this.processSnapshots(snapshots, index)
        },

        async processVideo(vidId: string) {
            const vidUrl = this.ytVidPrefix + vidId
            const snapshots = await this.getSnapshots(vidUrl)
            this.$emit('setSearchStatus', 200)
            this.$emit('addToVidDetails', this.VideoDetails(0, 0, vidUrl))
            this.processSnapshots(snapshots)
        },

        async getSnapshots (url:string) : Promise<UrlSnapshot[]> {
            let res
            if (import.meta.env.PROD) {
                res = await fetch(this.wbCorsProxy + this.cdx + url + this.cdxSuffix)
            } else {
                res = await fetch(this.cdx + url + this.cdxSuffix)
            }
            console.log(res)

            // TODO: Set error inside video card
            if (res.status !== 200) {
                this.setSearchError('Error fetching details from Wayback m/c. Try again?')
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
             // No data found on Wayback
            if ((snapshots === undefined) || (!snapshots.length)) {
                this.$emit('assignToVidDetails', {index : index, vidData: {searchStatus: 404, title: 'No data found', snapshots: 0}})

            } else {

                for (const [i, snapshot] of snapshots.entries()) {
                    const vidDetail = await this.extractVideoDetails(snapshot)

                    // Found details of a video OR Last snapshot
                    if (vidDetail.title && vidDetail.channelName) {
                        Object.assign(vidDetail, {snapshots : snapshots.length})
                        this.$emit('assignToVidDetails', {index : index, vidData: vidDetail})
                        break
                    } else if (i === (snapshots.length - 1)) {
                        // TODO : Saving details if Title only found in previous snapshots
                        Object.assign(vidDetail, {snapshots : snapshots.length})
                        this.$emit('assignToVidDetails', {index : index, vidData: vidDetail})
                    }
                }
            }
        },

        async extractVideoDetails(snapshot: UrlSnapshot) {
            const waybackUrl = this.waybackPrefix + snapshot.timestamp + this.waybackOpt + snapshot.original

            let waybackFetchUrl
            if (import.meta.env.PROD) {
                waybackFetchUrl = this.wbCorsProxy + waybackUrl
            } else {
                waybackFetchUrl = waybackUrl
            }

            const snapTime = Number(snapshot.timestamp)
            const snapDate = snapshot.timestamp.slice(6,8) + '/' + snapshot.timestamp.slice(4,6) + '/' + snapshot.timestamp.slice(0,4)
            
            const res = await fetch(waybackFetchUrl)

            // Error getting single snapshot from wayback
            if (res.status !== 200) {
                let searchStatus : VideoDetails["searchStatus"]
                let title
                if (res.status === 503) {
                    console.log(res.status)
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
                title = parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title')    
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
                //shorten
                title = parsedhtml.querySelector('#eow-title')?.getAttribute('title')
                channelName = parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.innerHTML || ''
                channelUrl = parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.getAttribute('href')
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#eow-description')?.innerHTML || ''
                published = parsedhtml.querySelector('.watch-video-date')?.innerHTML.trim()

            } else if (snapTime < 20140700000000) {
                //shorten
                title = parsedhtml.querySelector('#eow-title')?.getAttribute('title') || parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title') || ''
                channelName = parsedhtml.querySelector('#watch7-user-header .yt-user-name')?.innerHTML
                channelUrl = parsedhtml.querySelector('#watch7-user-header .yt-user-name')?.getAttribute('href')
                channelUrl = channelUrl ? (this.ytPrefix + channelUrl) : ''
                description = parsedhtml.querySelector('#eow-description')?.innerHTML || ''
                published = parsedhtml.querySelector('.watch-video-date')?.innerHTML

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
                    console.log(extract)
                    console.log(videoMeta)
                    console.log(videoMeta.microformat)

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

        resetInputUrl () {
            this.inputUrl = ''
        },

        setSearchError (error: string) {
            this.searchError = error
        }
    },

    data () {
        return {
            inputUrl: '',
            searchError: '',
            ytPrefix: 'https://www.youtube.com/',
            ytVidPrefix: 'https://www.youtube.com/watch?v=',
            
            // 
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

});
</script>