// Image blobs (bike photos, purchase receipts) live in IndexedDB, not
// localStorage. A downscaled phone photo is a few hundred KB, and localStorage
// counts strings as UTF-16, so a couple of base64 images blow past the ~5 MB
// origin quota and every write after that throws silently. IndexedDB stores the
// Blob directly and has a much larger budget.
//
// One object store, `images`, keyed by a caller-supplied string. Bike image keys
// are `${bikeId}:photo` and `${bikeId}:receipt` (see imageKey below).

const DB_NAME = 'spoke-record'
const STORE = 'images'
const VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  opening.catch(() => {
    dbPromise = null // let a later call retry a failed open
  })
  dbPromise = opening
  return opening
}

function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDb().then((db) => db.transaction(STORE, mode).objectStore(STORE))
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function imageKey(bikeId: string, role: 'photo' | 'receipt'): string {
  return `${bikeId}:${role}`
}

export async function putImage(key: string, blob: Blob): Promise<void> {
  const store = await tx('readwrite')
  await wrap(store.put(blob, key))
}

export async function getImage(key: string): Promise<Blob | undefined> {
  const store = await tx('readonly')
  return wrap(store.get(key) as IDBRequest<Blob | undefined>)
}

export async function deleteImage(key: string): Promise<void> {
  const store = await tx('readwrite')
  await wrap(store.delete(key))
}
