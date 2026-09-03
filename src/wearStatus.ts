import type { Component } from './types'

export type ComponentWearStatus = 'fine' | 'due_soon' | 'overdue'

export function getWearStatus(component: Component): ComponentWearStatus {
  const ratio = component.accumulatedKm / component.expectedLifespanKm
  if (ratio >= 1) return 'overdue'
  if (ratio >= 0.8) return 'due_soon'
  return 'fine'
}

export function getWearRatio(component: Component): number {
  return Math.min(component.accumulatedKm / component.expectedLifespanKm, 1)
}

// Wear status is only trustworthy if rides are being logged. Past this many days
// without a ride, show a neutral state instead of a green/amber/red color.
export const STALE_AFTER_DAYS = 21

export function isStale(lastRideDate: string | undefined, now: Date = new Date()): boolean {
  if (!lastRideDate) return true
  const last = new Date(lastRideDate).getTime()
  if (Number.isNaN(last)) return true
  const days = (now.getTime() - last) / (1000 * 60 * 60 * 24)
  return days > STALE_AFTER_DAYS
}
