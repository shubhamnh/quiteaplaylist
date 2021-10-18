interface AbsentVideo {
  pos?: number,
  videoId: string
}

interface Video {
  [videoId:string] : VideoDetails
}

interface VideoDetails {
  readonly id: string
  workerVersion : number
  // searchStatus: 0 | 102 | 200 | 204 | 206 | 404 | 500 | 503
  searchStatus: number
  source: 'worker' | 'cdx' | 'se' | 'wayback' | 'yt' | 'filmot'
  // 204 Deleted Snapshot
  url : string
  title?: string
  channelName?: string
  channelUrl?: string
  description?: string
  published?: string
  duration?: string
  status?: 'Deleted' | 'Private' | 'Unlisted' | 'Public'
  waybackUrl?: string
  snapshotTime?: string
  snapshots?: number
  snapshotsParsed?: number
}