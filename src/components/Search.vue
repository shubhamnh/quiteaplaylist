<template>
    <div>
      <!-- <div class=""> -->
        <input class="flex flex-row flex-grow items-center justify-between rounded-full bg-white border border-gray-300 focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200 
        text-base outline-none text-gray-700 px-3 mx-2 leading-8 transition-colors duration-200 ease-in-out max-w-lg"
          @keyup.enter="detectUrl(inputUrl)"
          v-model="inputUrl"
          type="text"
          placeholder="Enter Playlist or Video URL"
        />
        <!-- <span class="flex items-center">
          <button class="p-1 focus:outline-none focus:shadow-outline" @click="pasteClipboard">
            <img src="@/assets/icons/clipboard.svg" alt="Paste">
          </button>
        </span> -->
      <!-- </div> -->
      
      <button class="rounded-full h-10 w-10 
        bg-white border border-gray-300 focus:border-magenta-050 focus:ring-2 focus:ring-indigo-200" 
        @click="detectUrl(inputUrl)">
          <img src="@/assets/icons/arrow-right.svg" alt="Submit">
      </button>


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
      this.$emit('setError','')

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

      if (vidId && vidId.length === 11) {
        this.$emit('setSearchResult',true)
        this.getUrlDetails(vidId)
      } else if (plId) {
        this.$emit('setSearchResult',true)
        this.getPlDetails(plId)
      } else {
        this.$emit('setError', 'Could not detect Video or Playlist URL')
      }
    },

    async getPlDetails(plId: string) {
      let nextPageToken = ''
      let playlist = []
      let delPl = []
      let url, status
      let delCount = 0
      this.$emit('resetVidDetails')
      this.$emit('setNoRemovedVideoFound', false)


      // TODO: Checks for empty Playlist
      // Get all playlist items
      do {
        let { playlistItems, nPageToken } = await this.getPlPageItems(plId, nextPageToken);
        playlist.push(...playlistItems)
        nextPageToken = nPageToken
      } while (nextPageToken)

      console.log(playlist)

      // get deleted/private videos
      for (const playlistItem of playlist) {
        // Skip Public and Unlisted Videos
        if (playlistItem.status.privacyStatus === 'public' || playlistItem.status.privacyStatus === 'unlisted') {
          continue
        }

        // Consider 'private' and 'privacyStatusUnspecified' (deleted) videos
        // Create sequential empty video details
        url = this.ytVidPrefix + playlistItem.contentDetails.videoId
        status = playlistItem.status.privacyStatus === 'private' ? 'Private' : 'Deleted'
        this.$emit('addToVidDetails', this.VideoDetails(delCount, false, false, url, status, playlistItem.snippet.position + 1))

        delPl.push(playlistItem)
        delCount++
      }

      console.log(delPl)
      if (delPl.length) {
        for (const [index, playlistItem] of delPl.entries()) {
          this.processPlItem(index, playlistItem)
        }
      } else {
        this.$emit('setNoRemovedVideoFound', true)
      }
    },

    async processPlItem(index: number, playlistItem: PlaylistItem) {
      // Get snapshots of videos
      const url = this.ytVidPrefix + playlistItem.contentDetails.videoId
      const snapshots = await this.getSnapshots(url)

      // No data found on Wayback
      if ((snapshots === undefined) || (!snapshots.length)) {
        this.$emit('assignToVidDetails', {index : index, vidData: {fetchStatus: true, resultStatus: false, title: 'No data found'}})  
      } else {
        for (const [i, snapshot] of snapshots.entries()) {
          const vidDetail = await this.getVideoDetails(snapshot)

          // Found details of a video OR Last snapshot
          if (vidDetail.title && vidDetail.channelName) {
            this.$emit('assignToVidDetails', {index : index, vidData: vidDetail})
            break
          } else if (i === (snapshots.length - 1)) {
            this.$emit('assignToVidDetails', {index : index, vidData: vidDetail})
          }
        }
      }
    },

    async getUrlDetails(url: string) {
      url = this.ytVidPrefix + url
      console.log(url)
      const snapshots = await this.getSnapshots(url)
      this.$emit('addToVidDetails', this.VideoDetails(0, false, false, url, status))
      
      if ((snapshots === undefined) || (!snapshots.length)) {
        this.$emit('assignToVidDetails', {index : 0, vidData: {fetchStatus: true, resultStatus: false, title: 'No data found'}})  
      } else {
        // Sequential execution of async code
        for (const snapshot of snapshots) {
          const vidDetail = await this.getVideoDetails(snapshot)
          
            // Found details of a video
            if (vidDetail.title && vidDetail.channelName) {
              this.$emit('assignToVidDetails', {index : 0, vidData: vidDetail})
              break
            }
        }
      }
    },

    async getPlPageItems (plId: string, nextPageToken ?: string) {
      const res = await fetch(this.ytCorsProxy + this.ytapi + this.ytapipart + this.ytapipgresults + this.ytapipl + plId + this.ytapinxt + nextPageToken)
      const resjson = await res.json()
      const playlistItems : PlaylistItem[] = resjson.items
      const nPageToken = resjson.nextPageToken

      return { playlistItems, nPageToken };
    },

    async getSnapshots (url:string) : Promise<UrlSnapshot[]> {
      const res = await fetch(this.wbCorsProxy + this.cdx + url + this.cdxSuffix)
      console.log(res)
      if (res.status !== 200) {
          this.$emit('setError','Error fetching details from Wayback m/c')
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

    async getVideoDetails(snapshot: UrlSnapshot) {
      // console.log(snapshot)
      const waybackUrl = this.wbCorsProxy + this.waybackurl + snapshot.timestamp + this.waybackopt + snapshot.original
      const snapTime = Number(snapshot.timestamp)
      const snapDate = snapshot.timestamp.slice(6,8) + '/' + snapshot.timestamp.slice(4,6) + '/' + snapshot.timestamp.slice(0,4)

      const res = await fetch(waybackUrl)

      if (res.status == 503) {
        console.log(res.status)
        console.log('Wayback Machine seems to be down! Check Twitter!')
        this.$emit('setError',`Wayback Machine seems to be down.<br/><br/>Please check <a href="https://twitter.com/internetarchive/">Twitter</a>!`)
      } else {
        this.$emit('setError','')
      }

      const rawhtml = await res.text()
      // console.log(snapshot[1])
      // console.log(snapshot[2])
      // console.log(rawhtml)
      const parser = new DOMParser()
      const parsedhtml = parser.parseFromString(rawhtml, 'text/html')

      if (snapTime < 20100700000000) {
        const title = parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title') ? parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title') : ''
        const channelName = parsedhtml.querySelector('#watch-username > strong:nth-child(1)')?.innerHTML
        const channelUrl = parsedhtml.querySelector('#watch-username')?.getAttribute('href')
        const description = parsedhtml.querySelector('#watch-description-body > span:nth-child(4)')?.innerHTML ? parsedhtml.querySelector('#watch-description-body > span:nth-child(4)')?.innerHTML : ''
        const published = parsedhtml.querySelector('.watch-video-date')?.innerHTML
        
        return {
          fetchStatus: true,
          resultStatus: title ? true : false,
          title: title ? title : 'Could not find details',
          channelName: channelName,
          snapshotTime: snapDate,
          channelUrl: channelUrl ? (this.ytPrefix + channelUrl) : '',
          description: description,
          published: published,
          waybackUrl: waybackUrl
        }

      } else if (snapTime < 20110300000000) {
        const title = parsedhtml.querySelector('#eow-title')?.getAttribute('title') ? parsedhtml.querySelector('#eow-title')?.getAttribute('title') : ''
        const channelName = parsedhtml.querySelector('#watch-username > strong:nth-child(1)')?.innerHTML
        const channelUrl = parsedhtml.querySelector('#watch-username')?.getAttribute('href')
        const description = parsedhtml.querySelector('#eow-description')?.innerHTML ? parsedhtml.querySelector('#eow-description')?.innerHTML : ''
        const published = parsedhtml.querySelector('.watch-video-date')?.innerHTML
        
        return {
          fetchStatus: true,
          resultStatus: title ? true : false,
          title: title ? title : 'Could not find details',
          channelName: channelName,
          snapshotTime: snapDate,
          channelUrl: channelUrl ? (this.ytPrefix + channelUrl) : '',
          description: description,
          published: published,
          waybackUrl: waybackUrl
        }

      } else if (snapTime < 20130100000000) {
        //shorten
        const title = parsedhtml.querySelector('#eow-title')?.getAttribute('title') ? parsedhtml.querySelector('#eow-title')?.getAttribute('title') : ''
        const channelName = parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.innerHTML ? parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.innerHTML : ''
        const channelUrl = parsedhtml.querySelector('#watch-uploader-info > a:nth-child(1)')?.getAttribute('href')
        const description = parsedhtml.querySelector('#eow-description')?.innerHTML ? parsedhtml.querySelector('#eow-description')?.innerHTML : ''
        const published = parsedhtml.querySelector('.watch-video-date')?.innerHTML
        
        return {
          fetchStatus: true,
          resultStatus: title ? true : false,
          title: title ? title : 'Could not find details',
          channelName: channelName,
          snapshotTime: snapDate,
          channelUrl: channelUrl ? (this.ytPrefix + channelUrl) : '',
          description: description,
          published: published,
          waybackUrl: waybackUrl
        }

      } else if (snapTime < 20140700000000) {
        //shorten
        const title = parsedhtml.querySelector('#eow-title')?.getAttribute('title') ? parsedhtml.querySelector('#eow-title')?.getAttribute('title') : (parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title') ? parsedhtml.querySelector('#watch-headline-title > span:nth-child(1)')?.getAttribute('title') : '')
        const channelName = parsedhtml.querySelector('#watch7-user-header .yt-user-name')?.innerHTML
        const channelUrl = parsedhtml.querySelector('#watch7-user-header .yt-user-name')?.getAttribute('href')
        const description = parsedhtml.querySelector('#eow-description')?.innerHTML ? parsedhtml.querySelector('#eow-description')?.innerHTML : ''
        const published = parsedhtml.querySelector('.watch-video-date')?.innerHTML
        
        return {
          fetchStatus: true,
          resultStatus: title ? true : false,
          title: title ? title : 'Could not find details',
          channelName: channelName,
          snapshotTime: snapDate,
          channelUrl: channelUrl ? (this.ytPrefix + channelUrl) : '',
          description: description,
          published: published,
          waybackUrl: waybackUrl
        }

      } else if (snapTime < 20200702000000) {
        const title = parsedhtml.querySelector('#eow-title')?.getAttribute('title') ? parsedhtml.querySelector('#eow-title')?.getAttribute('title') : ''
        const channelName = parsedhtml.querySelector('.yt-user-info > a:nth-child(1)')?.innerHTML
        const channelUrl = parsedhtml.querySelector('.yt-user-info > a:nth-child(1)')?.getAttribute('href')
        const description = parsedhtml.querySelector('#eow-description')?.innerHTML ? parsedhtml.querySelector('#eow-description')?.innerHTML : ''
        const published = parsedhtml.querySelector('#watch-uploader-info')?.firstElementChild?.innerHTML ? parsedhtml.querySelector('#watch-uploader-info')?.firstElementChild?.innerHTML : ''
        
        return {
          fetchStatus: true,
          resultStatus: title ? true : false,
          title: title ? title : 'Could not find details',
          channelName: channelName,
          snapshotTime: snapDate,
          channelUrl: channelUrl ? (this.ytPrefix + channelUrl) : '',
          description: description,
          published: published,
          waybackUrl: waybackUrl
        }

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
            const errorMessage = videoMeta.playabilityStatus.errorScreen.playerErrorMessageRenderer
            const reason = errorMessage.reason.simpleText
            const subReason = errorMessage.subreason.simpleText ? errorMessage.subreason.simpleText : this.getSubreason(errorMessage)
            const errorReason = videoMeta.playabilityStatus.errorScreen ? `${reason} : ${subReason}` : undefined;
            
            console.log(subReason)
            return {
              fetchStatus: true,
              resultStatus: false,
              title: errorReason,
              snapshotTime: snapDate,
              waybackUrl: waybackUrl
            }
          }
        } else {
          return {
            fetchStatus: true,
            resultStatus: false,
            title: 'Could not find details, Player Response not found',
            snapshotTime: snapDate,
            waybackUrl: waybackUrl
          }
        }

        const title = videoMeta.microformat.playerMicroformatRenderer.title.simpleText
        const channelName = videoMeta.microformat.playerMicroformatRenderer.ownerChannelName
        const channelUrl = videoMeta.microformat.playerMicroformatRenderer.ownerProfileUrl
        const description = videoMeta.microformat.playerMicroformatRenderer.description ? videoMeta.microformat.playerMicroformatRenderer.description.simpleText : ''
        const duration = this.formatDuration(videoMeta.microformat.playerMicroformatRenderer.lengthSeconds)
        const published = videoMeta.microformat.playerMicroformatRenderer.publishDate

        return {
          fetchStatus: true,
          resultStatus: true,
          title: title,
          snapshotTime: snapDate,
          channelName: channelName,
          channelUrl: channelUrl,
          description: description,
          published: published,
          waybackUrl: waybackUrl,
          duration: duration
        }

      }
    },

    getSubreason(errorMessage : any) : string {
      let runText = ''
      if (errorMessage.subreason.runs) {
        console.log(errorMessage.subreason.runs.entries())
        for (const obj of errorMessage.subreason.runs){

          console.log(obj.text)
          runText += obj.text
        }
      }
      return runText
    },

    formatDuration(time : number) : string {   
        // Hours, minutes and seconds
        const hrs = ~~(time / 3600);
        const mins = ~~((time % 3600) / 60);
        const secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = '';
        if (hrs > 0) {
            ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
        }
        ret += '' + mins + ':' + (secs < 10 ? '0' : '');
        ret += '' + secs;
        return ret;
    },

    VideoDetails: (
      id: number,
      fetchStatus = false,
      resultStatus = false,
      url : string,
      status : string,
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
        fetchStatus: fetchStatus,
        resultStatus: resultStatus,
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
      } as VideoDetails;
    }
  },

  data () {
    return {
      inputUrl: '',
      ytPrefix: 'https://www.youtube.com/',
      ytVidPrefix: 'https://www.youtube.com/watch?v=',

      cdx: 'http://web.archive.org/cdx/search/cdx?url=',
      // cdxSuffix: '&output=json&filter=statuscode:200&limit=5&collapse=timestamp:8',
      cdxSuffix: '&output=json&filter=statuscode:200&from=2010&collapse=timestamp:6',
      
      waybackurl: 'https://web.archive.org/web/',
      waybackopt: 'id_/',
      wbCorsProxy: 'https://wb.shubhamnh.workers.dev/?',

      ytapi: 'https://youtube.googleapis.com/youtube/v3/playlistItems',
      ytapipart: '?part=contentDetails%2C%20status%2C%20id%2C%20snippet',
      ytapipgresults: '&maxResults=50', // 0 - 50
      ytapipl:'&playlistId=',
      ytapinxt: '&pageToken=',
      ytCorsProxy: 'https://yt-recover.shubhamnh.workers.dev/?',
    }
  },

});
</script>