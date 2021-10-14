import localforage from 'localforage'
const dbName = 'quiteaplaylist'

async function initializeDb () {
    await localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE])
}

export async function videoInstance () : Promise<LocalForage> {
    await initializeDb()
    return localforage.createInstance({
        name        : dbName,
        storeName   : 'Videos',
    })
}

export async function playlistInstance () : Promise<LocalForage> {
    await initializeDb()
    return localforage.createInstance({
        name        : dbName,
        storeName   : 'Playlists',
    })
}