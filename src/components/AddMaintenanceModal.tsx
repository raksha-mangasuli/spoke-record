import { useState } from 'react'
import type { Component } from '../types'
import { COMPONENT_LABELS } from '../types'

interface Props {
  components: Component[]
  onSave: (date: string, componentId: string | undefined, description: string, notes: string, cost?: number) => void
  onCancel: () => void
}

export function AddMaintenanceModal({ components, onSave, onCancel }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [componentId, setComponentId] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [cost, setCost] = useState('')

  const canSave = date && description.trim().length > 0

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Add maintenance</p>
          <span onClick={onCancel} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</span>
        </div>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ marginBottom: 14 }} />

        <label>Component (optional)</label>
        <select value={componentId} onChange={(e) => setComponentId(e.target.value)} style={{ marginBottom: 14 }}>
          <option value="">General / bike-level</option>
          {components.map((c) => (
            <option key={c.id} value={c.id}>
              {COMPONENT_LABELS[c.type]}
            </option>
          ))}
        </select>

        <label>Description</label>
        <input
          placeholder="Full tune-up, brake adjustment"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: 14 }}
        />

        <label>Notes (optional)</label>
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ marginBottom: 14, resize: 'none' }} />

        <label>Cost (optional)</label>
        <input placeholder="€45" value={cost} onChange={(e) => setCost(e.target.value)} style={{ marginBottom: 18 }} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary"
            style={{ flex: 1 }}
            disabled={!canSave}
            onClick={() =>
              onSave(date, componentId || undefined, description, notes, cost ? Number(cost.replace(/[^\d.]/g, '')) : undefined)
            }
          >
            Save entry
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
