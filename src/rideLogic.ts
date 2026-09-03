import type { Bike, Component, RideEntry } from './types'
import { generateId } from './types'

// Distances can be fractional (12.5 km), and repeated += drifts into float noise
// like 70.83000000000001. Round every stored running total to 2 decimals.
const km = (n: number) => Math.round(n * 100) / 100

export function insertRide(
  ride: Omit<RideEntry, 'id'>,
  bike: Bike,
  components: Component[]
): { newRide: RideEntry; updatedBike: Bike; updatedComponents: Component[] } {
  const newRide: RideEntry = { ...ride, id: generateId() }

  const updatedBike: Bike = {
    ...bike,
    totalKm: km(bike.totalKm + ride.distanceKm),
  }

  const updatedComponents = components.map((component) => {
    const isActiveOnThisBike =
      component.bikeId === ride.bikeId && component.status === 'active'
    if (!isActiveOnThisBike) return component
    return { ...component, accumulatedKm: km(component.accumulatedKm + ride.distanceKm) }
  })

  return { newRide, updatedBike, updatedComponents }
}

export function adjustBikeForRideChange(bike: Bike, deltaKm: number): Bike {
  return { ...bike, totalKm: km(bike.totalKm + deltaKm) }
}

export function adjustComponentsForRideChange(
  components: Component[],
  bikeId: string,
  deltaKm: number
): Component[] {
  return components.map((component) => {
    const isActiveOnThisBike = component.bikeId === bikeId && component.status === 'active'
    if (!isActiveOnThisBike) return component
    return { ...component, accumulatedKm: km(component.accumulatedKm + deltaKm) }
  })
}

export function editRide(
  oldRide: RideEntry,
  newDistanceKm: number,
  bike: Bike,
  components: Component[]
): { updatedRide: RideEntry; updatedBike: Bike; updatedComponents: Component[] } {
  const deltaKm = newDistanceKm - oldRide.distanceKm
  const updatedRide: RideEntry = { ...oldRide, distanceKm: newDistanceKm }
  const updatedBike = adjustBikeForRideChange(bike, deltaKm)
  const updatedComponents = adjustComponentsForRideChange(components, oldRide.bikeId, deltaKm)
  return { updatedRide, updatedBike, updatedComponents }
}

export function deleteRide(
  ride: RideEntry,
  bike: Bike,
  components: Component[]
): { updatedBike: Bike; updatedComponents: Component[] } {
  const deltaKm = -ride.distanceKm
  const updatedBike = adjustBikeForRideChange(bike, deltaKm)
  const updatedComponents = adjustComponentsForRideChange(components, ride.bikeId, deltaKm)
  return { updatedBike, updatedComponents }
}

export function retireComponent(
  component: Component,
  bike: Bike
): { retired: Component; replacement: Component } {
  const today = new Date().toISOString().split('T')[0]
  const retired: Component = { ...component, status: 'retired', retiredDate: today }
  const replacement: Component = {
    id: generateId(),
    bikeId: component.bikeId,
    type: component.type,
    installDate: today,
    installOdometerKm: bike.totalKm,
    status: 'active',
    accumulatedKm: 0,
    expectedLifespanKm: component.expectedLifespanKm,
  }
  return { retired, replacement }
}
