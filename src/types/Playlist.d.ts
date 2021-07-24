interface PlaylistList {
    kind: string
    etag: string
    nextPageToken: string
    prevPageToken: string
    pageInfo: {
        totalResults: number
        resultsPerPage: number
    },
    items: [Playlist]
}

interface Playlist {
    /**
     * The ID that YouTube uses to uniquely identify the playlist.
     */
    id: string
    /**
     * The type of the API resource. For video resources, the value will be youtube#playlist.
     */
    kind: string
    /**
     * The ETag for the playlist resource.
     */
    etag: string
    /**
     * The snippet object contains basic details about the playlist, such as its title and description.
     */
    snippet: {
        /**
         * The date and time that the playlist was created. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
         */
        publishedAt: string
        /**
         * The ID that YouTube uses to uniquely identify the channel that published the playlist.
         */
        channelId: string
        /**
         * The playlists title.
         */
        title: string
        /**
         * The playlists description.
         */
        description: string
        /**
         * A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
         */
        thumbnails: Thumbnail
        /**
         * The channel title of the channel that the video belongs to.
         */
        channelTitle: string
        /**
         * Keyword tags associated with the playlist.
         */
        tags: string[]
    }
    /**
     * The status object contains status information for the playlist.
     */
    status: {
        /**
         * The playlists privacy status.
         */
        privacyStatus: string
    }
    /**
     * The contentDetails object contains information about the playlist content, including the number of videos in the playlist.
     */
    contentDetails: {
        /**
         * The number of videos in the playlist.
         */
        itemCount: number
    }
    /**
     * The player object contains information that you would use to play the playlist in an embedded player.
     */
    player: {
        /**
         * An <iframe> tag that embeds a player that will play the playlist.
         */
        embedHtml: string
    }
}

interface Thumbnail {
    /**
     * The default thumbnail image. The default thumbnail for a video – or a resource that refers to a video, such as a playlist item or search result – is 120px wide and 90px tall. The default thumbnail for a channel is 88px wide and 88px tall.
     */
    default: ThumbnailItem
    /**
     * A higher resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 320px wide and 180px tall. For a channel, this image is 240px wide and 240px tall.
     */
    medium: ThumbnailItem
    /**
     * A high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.
     */
    high: ThumbnailItem
    /**
     * A standard resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.
     */
    standard?: ThumbnailItem | undefined
    /**
     * A very high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.
     */
    maxres?: ThumbnailItem | undefined
}

interface ThumbnailItem {
    /**
     * The images URL.
     */
    url: string
    /**
     * The images width.
     */
    width: number
    /**
     * The images height.
     */
    height: number
}