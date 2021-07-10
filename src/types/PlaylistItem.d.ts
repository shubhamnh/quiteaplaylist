interface PlaylistItem {
    contentDetails: {
      videoId: string
      videoPublishedAt: string
    }
    etag: string
    id: string
    kind: string
    snippet: {
      channelId: string
      channelTitle: string
      description: string
      playlistId: string
      position: number
      publishedAt: string
      resourceId: {
        kind: string
        videoId: string
      }
      thumbnails: unknown
      title: string
      videoOwnerChannelId: string
      videoOwnerChannelTitle: string
    }
    status: {
      privacyStatus: 'public' | 'private' | 'unlisted' | 'privacyStatusUnspecified'
    }
  }