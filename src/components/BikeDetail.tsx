import type { Bike, Component, RideEntry } from '../types'
import { COMPONENT_LABELS } from '../types'
import { BikeIcon, Chevron, WearBar, WearDot } from './Shared'

interface Props {
  bike: Bike
  components: Component[]
  rides: RideEntry[]
  onLogRide: () => void
  onAddMaintenance: () => void
  onSelectComponent: (componentId: string) => void
  onSelectRide: (rideId: string) => void
  onViewAllRides: () => void
  onBack: () => void
}

export function BikeDetail({
  bike,
  components,
  rides,
  onLogRide,
  onAddMaintenance,
  onSelectComponent,
  onSelectRide,
  onViewAllRides,
  onBack,
}: Props) {
  const activeComponents = components.filter((c) => c.bikeId === bike.id && c.status === 'active')
  const bikeRides = rides
    .filter((r) => r.bikeId === bike.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const recentRides = bikeRides.slice(0, 5)

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, marginBottom: 12, cursor: 'pointer' }}
      >
        ← Back
      </button>

      <div style={{ background: 'var(--header-tint)', borderRadius: '16px 16px 0 0', padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {bike.photoUrl ? (
            <img src={bike.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <BikeIcon size={28} />
          )}
        </div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 500 }}>{bike.nickname || bike.make}</p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
            {bike.make} {bike.model}
            {bike.purchaseDate ? ` · bought ${formatMonthYear(bike.purchaseDate)}` : ''}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            {bike.totalKm.toLocaleString()} km total
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: '0 0 16px 16px', padding: '0 0 4px' }}>
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <button className="primary" style={{ flex: 1 }} onClick={onLogRide}>
            + Log a ride
          </button>
          <button className="secondary" style={{ flex: 1 }} onClick={onAddMaintenance}>
            Add maintenance
          </button>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px' }}>Components</p>
          {activeComponents.map((component) => (
            <div
              key={component.id}
              onClick={() => onSelectComponent(component.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}
            >
              <WearDot component={component} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, margin: '0 0 4px' }}>{COMPONENT_LABELS[component.type]}</p>
                <WearBar component={component} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 80, textAlign: 'right' }}>
                {component.accumulatedKm}/{component.expectedLifespanKm}km
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Recent rides</p>
            {bikeRides.length > 0 && (
              <span onClick={onViewAllRides} style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer' }}>
                View all
              </span>
            )}
          </div>
          {recentRides.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No rides logged yet.</p>
          )}
          {recentRides.map((ride, i) => (
            <div
              key={ride.id}
              onClick={() => onSelectRide(ride.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                padding: '9px 0',
                borderTop: i === 0 ? undefined : '0.5px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, margin: 0 }}>{formatShortDate(ride.date)}</p>
                {ride.notes && (
                  <p style={{ fontSize: 12, margin: '1px 0 0', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ride.notes}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ride.distanceKm} km</span>
                <Chevron size={15} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatMonthYear(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatShortDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
