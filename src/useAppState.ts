import { useEffect, useState } from 'react'
import type { Bike, Component, RideEntry, MaintenanceLogEntry, ComponentType } from './types'
import { DEFAULT_LIFESPAN_KM, generateId } from './types'
import { storage } from './storage'
import { insertRide, editRide, deleteRide, retireComponent as retireComponentLogic } from './rideLogic'

const DEFAULT_COMPONENT_TYPES: ComponentType[] = [
  'chain',
  'tires_front',
  'tires_rear',
  'brake_pads_front',
  'brake_pads_rear',
]

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

  function addBike(input: Omit<Bike, 'id' | 'totalKm'>) {
    const bike: Bike = { ...input, id: generateId(), totalKm: 0 }
    const newComponents: Component[] = DEFAULT_COMPONENT_TYPES.map((type) => ({
      id: generateId(),
      bikeId: bike.id,
      type,
      installDate: bike.purchaseDate,
      installOdometerKm: 0,
      status: 'active',
      accumulatedKm: 0,
      expectedLifespanKm: DEFAULT_LIFESPAN_KM[type],
    }))
    setBikes((prev) => [...prev, bike])
    setComponents((prev) => [...prev, ...newComponents])
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

  function updateRideDistance(rideId: string, newDistanceKm: number) {
    const ride = rides.find((r) => r.id === rideId)
    const bike = bikes.find((b) => b.id === ride?.bikeId)
    if (!ride || !bike) return
    const { updatedRide, updatedBike, updatedComponents } = editRide(
      ride,
      newDistanceKm,
      bike,
      components
    )
    setRides((prev) => prev.map((r) => (r.id === rideId ? updatedRide : r)))
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
    updateRideDistance,
    removeRide,
    addMaintenanceEntry,
    retireComponent,
    updateComponentLifespan,
  }
}
