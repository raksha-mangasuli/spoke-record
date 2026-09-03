import { useState } from 'react'
import type { RideEntry } from '../types'
import { formatNumber } from '../format'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  ride: RideEntry
  onSave: (patch: { date: string; distanceKm: number; notes: string }) => void
  onDelete: () => void
  onBack: () => void
}

export function RideDetail({ ride, onSave, onDelete, onBack }: Props) {
  const [date, setDate] = useState(ride.date)
  const [distance, setDistance] = useState(String(ride.distanceKm))
  const [notes, setNotes] = useState(ride.notes ?? '')
  const [showConfirm, setShowConfirm] = useState(false)

  const canSave = date.length > 0 && Number(distance) > 0

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, marginBottom: 12, cursor: 'pointer' }}
      >
        ← Back
      </button>

      <div style={{ background: 'var(--surface)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: 20, borderBottom: '0.5px solid var(--border)' }}>
          <p style={{ fontSize: 18, fontWeight: 500, margin: '0 0 4px' }}>Ride</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{formatLongDate(date)}</p>
        </div>

        <div style={{ padding: 16, borderBottom: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label>Distance (km)</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </div>
          <div>
            <label>Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
          <button className="secondary" style={{ flex: 1 }} onClick={onBack}>
            Cancel
          </button>
          <button
            className="primary"
            style={{ flex: 1 }}
            disabled={!canSave}
            onClick={() => {
              onSave({ date, distanceKm: Number(distance), notes })
              onBack()
            }}
          >
            Save changes
          </button>
        </div>

        <div style={{ padding: 16 }}>
          <button
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--wear-overdue)',
              border: '0.5px solid var(--wear-overdue)',
            }}
            onClick={() => setShowConfirm(true)}
          >
            Delete ride
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0', textAlign: 'center', lineHeight: 1.4 }}>
            Removes this ride and takes its {formatNumber(ride.distanceKm)} km back off the components it counted toward.
          </p>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          destructive
          title="Delete this ride?"
          body={`The ${formatNumber(ride.distanceKm)} km logged on ${formatLongDate(ride.date)} will be removed and taken back off every component it counted toward. This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setShowConfirm(false)}
          onConfirm={onDelete}
        />
      )}
    </div>
  )
}

function formatLongDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
