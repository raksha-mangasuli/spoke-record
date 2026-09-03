// One number format across the whole app: comma thousands separator, dot
// decimal, at most 2 decimal places. Pinned to en-US so it does not shift with
// the viewer's browser locale (which is what made totals render inconsistently).
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
