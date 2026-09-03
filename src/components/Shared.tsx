import type { Component } from '../types'
import { getWearRatio, getWearStatus } from '../wearStatus'

export function BikeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5" cy="17.5" r="3.5" stroke="white" strokeWidth="1.6" />
      <circle cx="18.5" cy="17.5" r="3.5" stroke="white" strokeWidth="1.6" />
      <path
        d="M5.5 17.5L10 8H14M18.5 17.5L14 8M14 8L10.5 12.5H16.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 8H8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const statusColor: Record<string, string> = {
  fine: 'var(--wear-fine)',
  due_soon: 'var(--wear-due-soon)',
  overdue: 'var(--wear-overdue)',
}

const statusLabel: Record<string, string> = {
  fine: 'Fine',
  due_soon: 'Due soon',
  overdue: 'Overdue',
}

export function ImageLightbox({
  src,
  onClose,
  alt = 'Image',
}: {
  src: string
  onClose: () => void
  alt?: string
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 100,
        cursor: 'zoom-out',
      }}
    >
      <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 4 }} />
    </div>
  )
}

export function Chevron({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, opacity: 0.5 }}>
      <path d="M9 6l6 6-6 6" stroke="var(--text-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WearBar({ component }: { component: Component }) {
  const status = getWearStatus(component)
  const ratio = getWearRatio(component)
  const color = statusColor[status]
  return (
    <div style={{ flex: 1 }}>
      <div style={{ height: 4, background: 'var(--track-bg)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${ratio * 100}%`, background: color }} />
      </div>
    </div>
  )
}

export function WearDot({ component }: { component: Component }) {
  const status = getWearStatus(component)
  return <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor[status], flexShrink: 0 }} />
}

export function WearLabel({ component }: { component: Component }) {
  const status = getWearStatus(component)
  return <span style={{ color: statusColor[status], fontWeight: 500, fontSize: 13 }}>{statusLabel[status]}</span>
}
