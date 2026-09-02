import type { Bike, Component } from '../types'
import { BikeIcon } from './Shared'
import { getWearStatus } from '../wearStatus'

interface Props {
  bikes: Bike[]
  components: Component[]
  onSelectBike: (bikeId: string) => void
  onAddBike: () => void
}

export function BikeList({ bikes, components, onSelectBike, onAddBike }: Props) {
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 16px' }}>My bikes</h1>

      {bikes.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          No bikes yet. Add your first one to start tracking.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
        {bikes.map((bike) => {
          const bikeComponents = components.filter((c) => c.bikeId === bike.id && c.status === 'active')
          const needsAttention = bikeComponents.some((c) => getWearStatus(c) !== 'fine')
          return (
            <div
              key={bike.id}
              onClick={() => onSelectBike(bike.id)}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: 12,
                borderRadius: 12,
                border: '0.5px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
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
                  <BikeIcon size={22} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{bike.nickname || bike.make}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {bike.make} {bike.model}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {bike.totalKm.toLocaleString()} km total
                </p>
              </div>
              {needsAttention && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wear-due-soon)' }} />
              )}
            </div>
          )
        })}
      </div>

      <button className="secondary" style={{ width: '100%' }} onClick={onAddBike}>
        + Add bike
      </button>
    </div>
  )
}
