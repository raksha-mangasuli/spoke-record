import type { Component, MaintenanceLogEntry } from '../types'
import { COMPONENT_LABELS } from '../types'
import { formatDate, formatNumber } from '../format'
import { WearBar, WearLabel } from './Shared'

interface Props {
  component: Component
  maintenance: MaintenanceLogEntry[]
  onRetire: () => void
  onBack: () => void
}

export function ComponentDetail({ component, maintenance, onRetire, onBack }: Props) {
  const history = maintenance
    .filter((m) => m.componentId === component.id)
    .sort((a, b) => b.date.localeCompare(a.date))

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
          <p style={{ fontSize: 18, fontWeight: 500, margin: '0 0 12px' }}>{COMPONENT_LABELS[component.type]}</p>
          <WearBar component={component} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {formatNumber(component.accumulatedKm)} / {formatNumber(component.expectedLifespanKm)} km
            </span>
            <WearLabel component={component} />
          </div>
        </div>

        <div style={{ padding: 16, borderBottom: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Row label="Install date" value={formatDate(component.installDate)} />
          <Row label="Install odometer" value={`${formatNumber(component.installOdometerKm)} km`} />
          <Row label="Expected lifespan" value={`${formatNumber(component.expectedLifespanKm)} km`} />
        </div>

        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Maintenance history</p>
          {history.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No entries yet.</p>}
          {history.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 14, margin: 0 }}>{entry.description}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{formatDate(entry.date)}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 16px 20px' }}>
          <button className="primary" style={{ width: '100%' }} onClick={onRetire}>
            Retire this component
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
    </div>
  )
}
