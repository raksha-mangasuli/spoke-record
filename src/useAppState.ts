import { useEffect, useState } from 'react'
import type { Bike, Component, RideEntry, MaintenanceLogEntry, ComponentType } from './types'
import { DEFAULT_LIFESPAN_KM, generateId } from './types'
import { storage } from './storage'
import { imageKey, putImage, deleteImage } from './imageStore'
import { insertRide, editRide, deleteRide, retireComponent as retireComponentLogic } from './rideLogic'

const DEFAULT_COMPONENT_TYPES: ComponentType[] = [
  'chain',
  'tires_front',
  'tires_rear',
  'brake_pads_front',
  'brake_pads_rear',
]

function reportImageError(e: unknown) {
  console.error('Saving image to IndexedDB failed', e)
}

export function useAppState() {
  const [bikes, setBikes] = useState<Bike[]>(() => storage.loadBikes())
  const [components, setComponents] = useState<Component[]>(() => storage.loadComponents())
  const [rides, setRides] = useState<RideEntry[]>(() => storage.loadRides())
  const [maintenance, setMaintenance] = useState<MaintenanceLogEntry[]>(() =>
    storage.loadMaintenance()
  )

  useEffect(() => storage.saveBikes(bikes), [bikes])
  useEffect(() => storage.saveComponents(components), [components])
  useEffect(() => storage.saveRides(rides), [rides])
  useEffect(() => storage.saveMaintenance(maintenance), [maintenance])

  // One-time move of legacy data-URL images (stored inline in localStorage
  // before the IndexedDB switch) into imageStore, rewriting each bike field to
  // the new key. Idempotent: after one pass no `data:` values remain.
  useEffect(() => {
    if (localStorage.getItem('spoke-record:img-migrated')) return
    let cancelled = false
    void (async () => {
      const rewrites: Record<string, Partial<Bike>> = {}
      for (const b of storage.loadBikes()) {
        const patch: Partial<Bike> = {}
        if (b.photoUrl?.startsWith('data:')) {
          const key = imageKey(b.id, 'photo')
          await putImage(key, await (await fetch(b.photoUrl)).blob())
          patch.photoUrl = key
        }
        if (b.purchaseReceiptUrl?.startsWith('data:')) {
          const key = imageKey(b.id, 'receipt')
          await putImage(key, await (await fetch(b.purchaseReceiptUrl)).blob())
          patch.purchaseReceiptUrl = key
        }
        if (Object.keys(patch).length > 0) rewrites[b.id] = patch
      }
      if (cancelled) return
      if (Object.keys(rewrites).length > 0) {
        setBikes((prev) => prev.map((b) => (rewrites[b.id] ? { ...b, ...rewrites[b.id] } : b)))
      }
      localStorage.setItem('spoke-record:img-migrated', '1')
    })().catch((e) => console.error('image migration failed', e))
    return () => {
      cancelled = true
    }
  }, [])

  function addBike(
    input: Omit<Bike, 'id' | 'totalKm' | 'photoUrl' | 'purchaseReceiptUrl'>,
    photoBlob?: Blob,
    receiptBlob?: Blob
  ) {
    const id = generateId()
    const bike: Bike = {
      ...input,
      id,
      totalKm: 0,
      photoUrl: photoBlob ? imageKey(id, 'photo') : undefined,
      purchaseReceiptUrl: receiptBlob ? imageKey(id, 'receipt') : undefined,
    }
    const newComponents: Component[] = DEFAULT_COMPONENT_TYPES.map((type) => ({
      id: generateId(),
      bikeId: id,
      type,
      installDate: bike.purchaseDate,
      installOdometerKm: 0,
      status: 'active',
      accumulatedKm: 0,
      expectedLifespanKm: DEFAULT_LIFESPAN_KM[type],
    }))
    setBikes((prev) => [...prev, bike])
    setComponents((prev) => [...prev, ...newComponents])
    // Not awaited: the bike's structured data is already saved, so an image
    // write failure degrades to a missing thumbnail rather than losing the bike.
    if (photoBlob) putImage(imageKey(id, 'photo'), photoBlob).catch(reportImageError)
    if (receiptBlob) putImage(imageKey(id, 'receipt'), receiptBlob).catch(reportImageError)
    return bike
  }

  function addRide(input: Omit<RideEntry, 'id'>) {
    const bike = bikes.find((b) => b.id === input.bikeId)
    if (!bike) return
    const { newRide, updatedBike, updatedComponents } = insertRide(input, bike, components)
    setRides((prev) => [...prev, newRide])
    setBikes((prev) => prev.map((b) => (b.id === bike.id ? updatedBike : b)))
    setComponents(updatedComponents)
  }

  function updateRide(
    rideId: string,
    patch: { date?: string; distanceKm?: number; notes?: string }
  ) {
    const ride = rides.find((r) => r.id === rideId)
    const bike = bikes.find((b) => b.id === ride?.bikeId)
    if (!ride || !bike) return
    const newDistanceKm = patch.distanceKm ?? ride.distanceKm
    const { updatedRide, updatedBike, updatedComponents } = editRide(
      ride,
      newDistanceKm,
      bike,
      components
    )
    const finalRide: RideEntry = {
      ...updatedRide,
      date: patch.date ?? ride.date,
      notes: patch.notes !== undefined ? patch.notes || undefined : ride.notes,
    }
    setRides((prev) => prev.map((r) => (r.id === rideId ? finalRide : r)))
    setBikes((prev) => prev.map((b) => (b.id === bike.id ? updatedBike : b)))
    setComponents(updatedComponents)
  }

  function removeRide(rideId: string) {
    const ride = rides.find((r) => r.id === rideId)
    const bike = bikes.find((b) => b.id === ride?.bikeId)
    if (!ride || !bike) return
    const { updatedBike, updatedComponents } = deleteRide(ride, bike, components)
    setRides((prev) => prev.filter((r) => r.id !== rideId))
    setBikes((prev) => prev.map((b) => (b.id === bike.id ? updatedBike : b)))
    setComponents(updatedComponents)
  }

  function setBikeReceipt(bikeId: string, blob: Blob | undefined) {
    const key = imageKey(bikeId, 'receipt')
    if (blob) {
      putImage(key, blob).catch(reportImageError)
      setBikes((prev) =>
        prev.map((b) => (b.id === bikeId ? { ...b, purchaseReceiptUrl: key } : b))
      )
    } else {
      deleteImage(key).catch(() => {})
      setBikes((prev) =>
        prev.map((b) => (b.id === bikeId ? { ...b, purchaseReceiptUrl: undefined } : b))
      )
    }
  }

  function addMaintenanceEntry(input: Omit<MaintenanceLogEntry, 'id'>) {
    const entry: MaintenanceLogEntry = { ...input, id: generateId() }
    setMaintenance((prev) => [...prev, entry])
  }

  function retireComponent(componentId: string) {
    const component = components.find((c) => c.id === componentId)
    const bike = bikes.find((b) => b.id === component?.bikeId)
    if (!component || !bike) return
    const { retired, replacement } = retireComponentLogic(component, bike)
    setComponents((prev) => [...prev.map((c) => (c.id === componentId ? retired : c)), replacement])
  }

  function updateComponentLifespan(componentId: string, expectedLifespanKm: number) {
    setComponents((prev) =>
      prev.map((c) => (c.id === componentId ? { ...c, expectedLifespanKm } : c))
    )
  }

  return {
    bikes,
    components,
    rides,
    maintenance,
    addBike,
    addRide,
    updateRide,
    removeRide,
    addMaintenanceEntry,
    setBikeReceipt,
    retireComponent,
    updateComponentLifespan,
  }
}
