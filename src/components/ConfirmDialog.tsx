interface Props {
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel, destructive }: Props) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.45 }}>
          {body}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={destructive ? undefined : 'primary'}
            style={{
              flex: 1,
              ...(destructive
                ? { background: 'var(--wear-overdue)', color: '#fff', border: 'none' }
                : {}),
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
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
  maxWidth: 300,
  background: 'var(--page-bg)',
  borderRadius: 12,
  border: '0.5px solid var(--border)',
  padding: 20,
}
