interface VideoDetails {
  readonly id: number
  fetchStatus: boolean
  resultStatus: boolean
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