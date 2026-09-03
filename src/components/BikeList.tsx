import type { Bike, Component, RideEntry } from '../types'
import { BikeIcon } from './Shared'
import { useImageUrl } from '../useImageUrl'
import { getWearStatus, isStale } from '../wearStatus'

interface Props {
  bikes: Bike[]
  components: Component[]
  rides: RideEntry[]
  onSelectBike: (bikeId: string) => void
  onAddBike: () => void
}

export function BikeList({ bikes, components, rides, onSelectBike, onAddBike }: Props) {
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
          const lastRide = rides
            .filter((r) => r.bikeId === bike.id)
            .reduce<string | undefined>((latest, r) => (!latest || r.date > latest ? r.date : latest), undefined)
          const stale = isStale(lastRide)
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
              <BikeThumb bike={bike} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{bike.nickname || bike.make}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {bike.make} {bike.model}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {bike.totalKm.toLocaleString()} km total
                </p>
              </div>
              {stale ? (
                <div
                  title="No recent rides"
                  style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-secondary)', opacity: 0.5 }}
                />
              ) : (
                needsAttention && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wear-due-soon)' }} />
                )
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

function BikeThumb({ bike }: { bike: Bike }) {
  const photoUrl = useImageUrl(bike.photoUrl)
  return (
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
      {photoUrl ? (
        <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <BikeIcon size={22} />
      )}
    </div>
  )
}
