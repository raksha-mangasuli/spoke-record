// One number format across the whole app: no thousands grouping, dot decimal,
// at most 2 decimal places, so the only separator that ever appears on screen is
// the decimal point (2000, not 2,000). Pinned to en-US so it does not shift with
// the viewer's browser locale.
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2, useGrouping: false })
}

// Dates are stored as yyyy-mm-dd. Parse them at local midnight, not UTC, so a
// negative-offset timezone does not shift the displayed day back by one.
function parseDate(iso: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso)
}

const DATE_OPTS = { year: 'numeric', month: 'short', day: 'numeric' } as const
const MONTH_YEAR_OPTS = { year: 'numeric', month: 'short' } as const
const LONG_OPTS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const

// "Aug 31, 2025" - the default for any full date shown in the UI.
export function formatDate(iso: string): string {
  const d = parseDate(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', DATE_OPTS)
}

// "Mar 2024" - for the bike's purchase month.
export function formatMonthYear(iso: string): string {
  const d = parseDate(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', MONTH_YEAR_OPTS)
}

// "Sunday, August 31, 2025" - for the Ride Details header.
export function formatLongDate(iso: string): string {
  const d = parseDate(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', LONG_OPTS)
}
