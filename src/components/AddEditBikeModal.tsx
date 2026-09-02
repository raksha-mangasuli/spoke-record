import { useState } from 'react'

interface Props {
  onSave: (make: string, model: string, nickname: string, purchaseDate: string, serialNumber: string, photoUrl?: string) => void
  onCancel: () => void
}

export function AddEditBikeModal({ onSave, onCancel }: Props) {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [nickname, setNickname] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0])
  const [serialNumber, setSerialNumber] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)

  const canSave = make.trim().length > 0 && model.trim().length > 0

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Add bike</p>
          <span onClick={onCancel} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</span>
        </div>

        <label htmlFor="photo-input">Photo</label>
        <label
          htmlFor="photo-input"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 90,
            borderRadius: 8,
            border: '0.5px solid var(--border)',
            background: 'white',
            marginBottom: 14,
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          {photoUrl ? (
            <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>+ Add photo</span>
          )}
        </label>
        <input id="photo-input" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />

        <label>Make</label>
        <input placeholder="Canyon" value={make} onChange={(e) => setMake(e.target.value)} style={{ marginBottom: 14 }} />

        <label>Model</label>
        <input placeholder="Grail" value={model} onChange={(e) => setModel(e.target.value)} style={{ marginBottom: 14 }} />

        <label>Nickname (optional)</label>
        <input placeholder="Gravel bike" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ marginBottom: 14 }} />

        <label>Purchase date</label>
        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} style={{ marginBottom: 14 }} />

        <label>Serial number (optional)</label>
        <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} style={{ marginBottom: 18 }} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary"
            style={{ flex: 1 }}
            disabled={!canSave}
            onClick={() => onSave(make, model, nickname, purchaseDate, serialNumber, photoUrl)}
          >
            Save bike
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
  maxHeight: '90vh',
  overflowY: 'auto',
}
