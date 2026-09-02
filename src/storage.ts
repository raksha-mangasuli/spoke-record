import type { Bike, Component, RideEntry, MaintenanceLogEntry } from './types'

const KEYS = {
  bikes: 'spoke-record:bikes',
  components: 'spoke-record:components',
  rides: 'spoke-record:rides',
  maintenance: 'spoke-record:maintenance',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  loadBikes: () => load<Bike[]>(KEYS.bikes, []),
  saveBikes: (bikes: Bike[]) => save(KEYS.bikes, bikes),
  loadComponents: () => load<Component[]>(KEYS.components, []),
  saveComponents: (components: Component[]) => save(KEYS.components, components),
  loadRides: () => load<RideEntry[]>(KEYS.rides, []),
  saveRides: (rides: RideEntry[]) => save(KEYS.rides, rides),
  loadMaintenance: () => load<MaintenanceLogEntry[]>(KEYS.maintenance, []),
  saveMaintenance: (entries: MaintenanceLogEntry[]) => save(KEYS.maintenance, entries),
}
