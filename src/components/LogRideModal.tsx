import { useState } from 'react'
import type { Bike } from '../types'

interface Props {
  bikes: Bike[]
  defaultBikeId: string
  onSave: (bikeId: string, date: string, distanceKm: number, notes: string) => void
  onCancel: () => void
}

export function LogRideModal({ bikes, defaultBikeId, onSave, onCancel }: Props) {
  const [bikeId, setBikeId] = useState(defaultBikeId)
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [distance, setDistance] = useState('')
  const [notes, setNotes] = useState('')

  const canSave = bikeId && date && Number(distance) > 0

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Log a ride</p>
          <span onClick={onCancel} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</span>
        </div>

        <label>Bike</label>
        <select value={bikeId} onChange={(e) => setBikeId(e.target.value)} style={{ marginBottom: 14 }}>
          {bikes.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nickname || b.make} ({b.make} {b.model})
            </option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ marginBottom: 14 }} />

        <label>Distance (km)</label>
        <input
          type="number"
          placeholder="32"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          style={{ marginBottom: 14 }}
        />

        <label>Notes (optional)</label>
        <textarea
          placeholder="Commute, easy pace"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ marginBottom: 18, resize: 'none' }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary"
            style={{ flex: 1 }}
            disabled={!canSave}
            onClick={() => onSave(bikeId, date, Number(distance), notes)}
          >
            Save ride
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 100,
}

const modalStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 340,
  background: 'var(--page-bg)',
  borderRadius: 12,
  border: '0.5px solid var(--border)',
  padding: 20,
}
