const ytCorsProxy = import.meta.env.VITE_YT_PROXY
const ytApiKey = import.meta.env.VITE_YT_API_KEY
const ytApiKeyQ = '&key='

export async function fetchPlaylist (playlistId: string) : Promise<Playlist> {
    const ytPlaylistApi = 'https://youtube.googleapis.com/youtube/v3/playlists?'
    const ytPlaylistApiPart = 'part=snippet%2CcontentDetails%2Cstatus'
    const ytPlaylistApiId = '&id='

    let playlistResponse : PlaylistList, fetchUrl

    if (import.meta.env.PROD) {
        fetchUrl = ytCorsProxy + ytPlaylistApi + ytPlaylistApiPart + ytPlaylistApiId + playlistId
    } else {
        fetchUrl = ytPlaylistApi + ytPlaylistApiPart + ytPlaylistApiId + playlistId + ytApiKeyQ + ytApiKey
    }

    return fetch(fetchUrl).then( async (res) => {
            if(!res.ok) {
                throw Error(res.status.toString())
            }
            playlistResponse = await res.json()
            return playlistResponse.items[0]
        }
    )
}

export async function fetchPlaylistItems (playlistId: string) : Promise<PlaylistItem[]> {
    let playlistItems : PlaylistItem[] = [], nextPageToken = ''
    do {
        let { playlistPageItems, nPageToken } = await getPlaylistPageItems(playlistId, nextPageToken)

        playlistItems.push(...playlistPageItems)
        nextPageToken = nPageToken
    } while (nextPageToken)

    return playlistItems
}

async function getPlaylistPageItems (playlistId: string, nextPageToken ?: string)
: Promise <{ playlistPageItems: PlaylistItem[]; nPageToken: string; }> {
    const ytPlaylistItemsApi = 'https://youtube.googleapis.com/youtube/v3/playlistItems?'
    const ytPlaylistItemsApiPart = 'part=contentDetails%2C%20status%2C%20id%2C%20snippet'
    const ytPlaylistItemsApiMax = '&maxResults=50' // 0 - 50
    const ytPlaylistItemsApiId ='&playlistId='
    const ytPlaylistItemsApiPg = '&pageToken='

    let fetchUrl = ''
    const nextPageUrl = ytPlaylistItemsApi + ytPlaylistItemsApiPart + ytPlaylistItemsApiMax + ytPlaylistItemsApiId + playlistId + ytPlaylistItemsApiPg + nextPageToken

    if (import.meta.env.PROD) {
        fetchUrl = ytCorsProxy + nextPageUrl
    } else {
        fetchUrl = nextPageUrl + ytApiKeyQ + ytApiKey
    }

    return await fetch(fetchUrl).then( async res => {
        if (!res.ok) {
            throw Error('Could not get Playlist Items.')
        }
        
        const responseJson = await res.json()
        const playlistPageItems : PlaylistItem[] = responseJson.items
        const nPageToken = responseJson.nextPageToken

        return { playlistPageItems, nPageToken }
    })
}