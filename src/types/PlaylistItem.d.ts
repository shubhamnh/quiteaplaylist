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

// interface GoogleApiYouTubePlaylistItemResource {
//   /**
//    * The ID that YouTube uses to uniquely identify the playlist item.
//    */
//   id: string;
//   /**
//    * The type of the API resource. For playlist item resources, the value will be youtube#playlistItem.
//    */
//   kind: string;
//   /**
//    * The ETag for the playlist item resource.
//    */
//   etag: string;
//   /**
//    * The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
//    */
//   snippet: {
//       /**
//        * The date and time that the item was added to the playlist. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
//        */
//       publishedAt: string;
//       /**
//        * The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
//        */
//       channelId: string;
//       /**
//        * The items title.
//        */
//       title: string;
//       /**
//        * The items description.
//        */
//       description: string;
//       /**
//        * A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
//        */
//       thumbnails: GoogleApiYouTubeThumbnailResource;
//       /**
//        * The channel title of the channel that the playlist item belongs to.
//        */
//       channelTitle: string;
//       /**
//        * The ID that YouTube uses to uniquely identify the playlist that the playlist item is in.
//        */
//       playlistId: string;
//       /**
//        * The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of 0, the second item has a position of 1, and so forth.
//        */
//       position: number;
//       /**
//        * The id object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.
//        */
//       resourceId: {
//           /**
//            * The kind, or type, of the referred resource.
//            */
//           kind: string;
//           /**
//            * If the snippet.resourceId.kind propertys value is youtube#video, then this property will be present and its value will contain the ID that YouTube uses to uniquely identify the video in the playlist.
//            */
//           videoId: string;
//       }
//   }
//   /**
//    * The contentDetails object is included in the resource if the included item is a YouTube video. The object contains additional information about the video.
//    */
//   contentDetails: {
//       /**
//        * The ID that YouTube uses to uniquely identify a video. To retrieve the video resource, set the id query parameter to this value in your API request.
//        */
//       videoId: string;
//       /**
//        * The time, measured in seconds from the start of the video, when the video should start playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) The default value is 0.
//        */
//       startAt: string;
//       /**
//        * The time, measured in seconds from the start of the video, when the video should stop playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) By default, assume that the video.endTime is the end of the video.
//        */
//       endAt: string;
//       /**
//        * A user-generated note for this item.
//        */
//       note: string;
//   }
//   /**
//    * The status object contains information about the playlist items privacy status.
//    */
//   status: {
//       /**
//        * The playlist items privacy status. The channel that uploaded the video that the playlist item represents can set this value using either the videos.insert or videos.update method.
//        */
//       privacyStatus: string;
//   }
// }
