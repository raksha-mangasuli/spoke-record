import { useRef, useState } from 'react'
import type { Bike, Component, RideEntry } from '../types'
import { COMPONENT_LABELS } from '../types'
import { fileToDownscaledBlob } from '../imageUtils'
import { useImageUrl } from '../useImageUrl'
import { isStale } from '../wearStatus'
import { ConfirmDialog } from './ConfirmDialog'
import { BikeIcon, Chevron, ImageLightbox, WearBar, WearDot } from './Shared'

interface Props {
  bike: Bike
  components: Component[]
  rides: RideEntry[]
  onLogRide: () => void
  onAddMaintenance: () => void
  onSelectComponent: (componentId: string) => void
  onSelectRide: (rideId: string) => void
  onViewAllRides: () => void
  onSetReceipt: (blob: Blob | undefined) => void
  onEdit: () => void
  onDelete: () => void
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
  onSetReceipt,
  onEdit,
  onDelete,
  onBack,
}: Props) {
  const receiptInputRef = useRef<HTMLInputElement>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const photoUrl = useImageUrl(bike.photoUrl)
  const receiptUrl = useImageUrl(bike.purchaseReceiptUrl)

  function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    fileToDownscaledBlob(file).then(onSetReceipt).catch(() => {})
  }

  const activeComponents = components.filter((c) => c.bikeId === bike.id && c.status === 'active')
  const bikeRides = rides
    .filter((r) => r.bikeId === bike.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const recentRides = bikeRides.slice(0, 5)
  const stale = isStale(bikeRides[0]?.date)

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
          onClick={photoUrl ? () => setShowPhoto(true) : undefined}
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
            cursor: photoUrl ? 'pointer' : 'default',
          }}
        >
          {photoUrl ? (
            <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <BikeIcon size={28} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 500 }}>{bike.nickname || bike.make}</p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
            {bike.make} {bike.model}
            {bike.purchaseDate ? ` · bought ${formatMonthYear(bike.purchaseDate)}` : ''}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            {bike.totalKm.toLocaleString()} km total
          </p>
        </div>
        <span
          onClick={onEdit}
          style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start' }}
        >
          Edit
        </span>
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
          {stale && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
              No rides logged in 3+ weeks. Wear status may be out of date.
            </p>
          )}
          {activeComponents.map((component) => (
            <div
              key={component.id}
              onClick={() => onSelectComponent(component.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}
            >
              <WearDot component={component} stale={stale} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, margin: '0 0 4px' }}>{COMPONENT_LABELS[component.type]}</p>
                <WearBar component={component} stale={stale} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 80, textAlign: 'right' }}>
                {component.accumulatedKm}/{component.expectedLifespanKm}km
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <input
            ref={receiptInputRef}
            type="file"
            accept="image/*"
            onChange={handleReceiptChange}
            style={{ display: 'none' }}
          />
          {bike.purchaseReceiptUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                onClick={() => setShowReceipt(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, cursor: 'pointer' }}
              >
                <div style={{ width: 44, height: 34, borderRadius: 4, border: '0.5px solid var(--border)', background: '#fff', overflow: 'hidden', flexShrink: 0 }}>
                  {receiptUrl && (
                    <img src={receiptUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <p style={{ fontSize: 14, margin: 0, flex: 1 }}>Purchase receipt</p>
                <Chevron size={16} />
              </div>
              <span
                onClick={() => receiptInputRef.current?.click()}
                style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
              >
                Replace
              </span>
            </div>
          ) : (
            <div
              onClick={() => receiptInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <div style={{ width: 44, height: 34, borderRadius: 4, border: '0.5px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-secondary)', fontSize: 18, lineHeight: 1 }}>
                +
              </div>
              <p style={{ fontSize: 14, margin: 0, flex: 1 }}>Add purchase receipt</p>
              <Chevron size={16} />
            </div>
          )}
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

        <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)' }}>
          <button
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--wear-overdue)',
              border: '0.5px solid var(--wear-overdue)',
            }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete bike
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          destructive
          title={`Delete ${bike.nickname || `${bike.make} ${bike.model}`}?`}
          body={`This removes the bike, its components, and ${bikeRides.length} logged ${
            bikeRides.length === 1 ? 'ride' : 'rides'
          }. This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={onDelete}
        />
      )}

      {showPhoto && photoUrl && (
        <ImageLightbox
          src={photoUrl}
          alt={`${bike.make} ${bike.model}`}
          onClose={() => setShowPhoto(false)}
        />
      )}

      {showReceipt && receiptUrl && (
        <ImageLightbox src={receiptUrl} alt="Purchase receipt" onClose={() => setShowReceipt(false)} />
      )}
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
