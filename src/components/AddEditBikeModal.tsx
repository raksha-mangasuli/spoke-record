import { useState } from 'react'
import { fileToDownscaledBlob } from '../imageUtils'
import { useBlobUrl } from '../useImageUrl'

interface Props {
  onSave: (
    make: string,
    model: string,
    nickname: string,
    purchaseDate: string,
    serialNumber: string,
    photoBlob?: Blob,
    receiptBlob?: Blob
  ) => void
  onCancel: () => void
}

export function AddEditBikeModal({ onSave, onCancel }: Props) {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [nickname, setNickname] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0])
  const [serialNumber, setSerialNumber] = useState('')
  const [photoBlob, setPhotoBlob] = useState<Blob | undefined>(undefined)
  const [receiptBlob, setReceiptBlob] = useState<Blob | undefined>(undefined)
  const photoUrl = useBlobUrl(photoBlob)
  const purchaseReceiptUrl = useBlobUrl(receiptBlob)

  const canSave =
    make.trim().length > 0 && model.trim().length > 0 && purchaseDate.length > 0

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    fileToDownscaledBlob(file)
      .then(setPhotoBlob)
      .catch(() => {})
  }

  function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    fileToDownscaledBlob(file)
      .then(setReceiptBlob)
      .catch(() => {})
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

        <label>
          Make <span style={{ color: 'var(--required)' }}>*</span>
        </label>
        <input
          placeholder="Canyon"
          required
          value={make}
          onChange={(e) => setMake(e.target.value)}
          style={{ marginBottom: 14 }}
        />

        <label>
          Model/Bike Type <span style={{ color: 'var(--required)' }}>*</span>
        </label>
        <input
          placeholder="Grail"
          required
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ marginBottom: 14 }}
        />

        <label>Nickname</label>
        <input placeholder="Gravel bike" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ marginBottom: 14 }} />

        <label>
          Purchase date <span style={{ color: 'var(--required)' }}>*</span>
        </label>
        <input
          type="date"
          required
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          style={{ marginBottom: 14 }}
        />

        <label>Serial number</label>
        <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} style={{ marginBottom: 14 }} />

        <label htmlFor="receipt-input">Purchase receipt</label>
        <label
          htmlFor="receipt-input"
          style={{
            display: 'block',
            borderRadius: 8,
            border: '0.5px solid var(--border)',
            background: 'white',
            marginBottom: 6,
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          {purchaseReceiptUrl ? (
            <>
              <img src={purchaseReceiptUrl} alt="" style={{ display: 'block', width: '100%', maxHeight: 160, objectFit: 'contain', background: '#f1ece2' }} />
              <span style={{ display: 'block', borderTop: '0.5px solid var(--border)', padding: '7px 10px', fontSize: 12, color: 'var(--accent)' }}>
                Replace
              </span>
            </>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90, fontSize: 13, color: 'var(--text-secondary)' }}>
              + Add receipt image
            </span>
          )}
        </label>
        <input id="receipt-input" type="file" accept="image/*" onChange={handleReceiptChange} style={{ display: 'none' }} />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.4 }}>
          A photo of your bill. Kept on this device only.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary"
            style={{ flex: 1 }}
            disabled={!canSave}
            onClick={() => onSave(make, model, nickname, purchaseDate, serialNumber, photoBlob, receiptBlob)}
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
