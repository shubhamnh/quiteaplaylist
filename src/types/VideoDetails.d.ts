interface VideoDetails {
  readonly id: number
  searchStatus: 0 | 102 | 200 | 204 | 206 | 404 | 500 | 503
  // 204 Deleted Snapshot
  url: string
  title: string
  channelName: string
  channelUrl: string
  description: string
  published: string
  duration?: string
  status?: 'Deleted' | 'Private' | 'Unlisted' | 'Public'
  waybackUrl: string
  snapshotTime?: string
  playlistPosition?: number
}