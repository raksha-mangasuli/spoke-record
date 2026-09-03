export type ComponentType =
  | 'chain'
  | 'tires_front'
  | 'tires_rear'
  | 'brake_pads_front'
  | 'brake_pads_rear'

export type ComponentStatus = 'active' | 'retired'

export interface Bike {
  id: string
  make: string
  model: string
  nickname?: string
  purchaseDate: string // ISO date
  photoUrl?: string // IndexedDB image key (see imageStore), not a data URL
  purchaseReceiptUrl?: string // IndexedDB image key for the purchase bill (see imageStore), not a data URL
  serialNumber?: string
  totalKm: number
}

export interface Component {
  id: string
  bikeId: string
  type: ComponentType
  installDate: string
  installOdometerKm: number
  status: ComponentStatus
  retiredDate?: string
  accumulatedKm: number
  expectedLifespanKm: number
}

export interface RideEntry {
  id: string
  bikeId: string
  date: string
  distanceKm: number
  notes?: string
}

export interface MaintenanceLogEntry {
  id: string
  bikeId: string
  componentId?: string
  date: string
  description: string
  notes?: string
  cost?: number
}

export const DEFAULT_LIFESPAN_KM: Record<ComponentType, number> = {
  chain: 2000,
  tires_front: 3000,
  tires_rear: 3000,
  brake_pads_front: 1500,
  brake_pads_rear: 1500,
}

export const COMPONENT_LABELS: Record<ComponentType, string> = {
  chain: 'Chain',
  tires_front: 'Tires (front)',
  tires_rear: 'Tires (rear)',
  brake_pads_front: 'Brake pads (front)',
  brake_pads_rear: 'Brake pads (rear)',
}

export function generateId(): string {
  return crypto.randomUUID()
}
