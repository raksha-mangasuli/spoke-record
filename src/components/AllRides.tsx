import type { Bike, RideEntry } from '../types'
import { formatNumber } from '../format'
import { Chevron } from './Shared'

interface Props {
  bike: Bike
  rides: RideEntry[]
  onSelectRide: (rideId: string) => void
  onBack: () => void
}

export function AllRides({ bike, rides, onSelectRide, onBack }: Props) {
  const bikeRides = rides
    .filter((r) => r.bikeId === bike.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, marginBottom: 12, cursor: 'pointer' }}
      >
        ← Back
      </button>

      <div style={{ background: 'var(--header-tint)', borderRadius: '16px 16px 0 0', padding: '16px 20px' }}>
        <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 500 }}>All rides</p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          {bike.nickname || bike.make} · {bikeRides.length} {bikeRides.length === 1 ? 'ride' : 'rides'} · {formatNumber(bike.totalKm)} km
        </p>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: '0 0 16px 16px', padding: '2px 20px 8px' }}>
        {bikeRides.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '14px 0' }}>No rides logged yet.</p>
        )}
        {bikeRides.map((ride, i) => (
          <div
            key={ride.id}
            onClick={() => onSelectRide(ride.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              padding: '11px 0',
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
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatNumber(ride.distanceKm)} km</span>
              <Chevron size={15} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatShortDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
