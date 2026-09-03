import { useEffect, useState } from 'react'
import { getImage } from './imageStore'

// Resolve a stored image key to a URL usable in <img src>. The key is what lives
// on Bike.photoUrl / Bike.purchaseReceiptUrl: normally an IndexedDB key, so we
// load the Blob and hand back an object URL, revoking it when the key changes or
// the component unmounts. A leftover `data:` value (pre-migration) is handled
// during render. The loaded URL is tagged with its key so a stale one is
// filtered out in render rather than cleared with an extra setState.
export function useImageUrl(key: string | undefined): string | undefined {
  const [entry, setEntry] = useState<{ key: string; url: string }>()

  useEffect(() => {
    if (!key || key.startsWith('data:')) return

    let cancelled = false
    let objectUrl: string | undefined
    getImage(key)
      .then((blob) => {
        if (cancelled || !blob) return
        objectUrl = URL.createObjectURL(blob)
        setEntry({ key, url: objectUrl })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [key])

  if (key && key.startsWith('data:')) return key
  return entry && entry.key === key ? entry.url : undefined
}

// Object URL for an in-memory Blob (e.g. a freshly picked, not-yet-saved image),
// revoked when the blob changes or the component unmounts. The object URL is
// owned by the effect so its lifetime matches the subscription; deriving it in
// render (useMemo) would leak one URL per StrictMode double-invoke.
export function useBlobUrl(blob: Blob | undefined): string | undefined {
  const [entry, setEntry] = useState<{ blob: Blob; url: string }>()

  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    // The effect owns the object URL so its lifetime matches the cleanup; the
    // setState is the point of the effect, not a cascading-render mistake.
    // oxlint-disable-next-line react/set-state-in-effect
    setEntry({ blob, url })
    return () => URL.revokeObjectURL(url)
  }, [blob])

  return entry && entry.blob === blob ? entry.url : undefined
}
