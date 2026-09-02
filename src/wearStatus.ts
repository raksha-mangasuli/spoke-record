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
