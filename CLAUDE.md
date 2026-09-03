# Spoke Record

Bike maintenance tracking PWA. Personal-use-first, resale-trust angle grows out of good data later, not designed upfront.

## Stack

- React + TypeScript + Vite
- PWA via vite-plugin-pwa (installable, offline-capable, from the start)
- No backend in v1, local storage only
- Capacitor is the planned later path if a real installable app is wanted, not React Native

## Data schema (locked, do not redesign without discussion)

```typescript
type ComponentType =
  | 'chain'
  | 'tires_front'
  | 'tires_rear'
  | 'brake_pads_front'
  | 'brake_pads_rear';

type ComponentStatus = 'active' | 'retired';

interface Bike {
  id: string;
  make: string;
  model: string;
  nickname?: string;
  purchaseDate: string; // ISO date
  photoUrl?: string; // IndexedDB image key (see src/imageStore.ts), not a data URL
  purchaseReceiptUrl?: string; // IndexedDB image key for the purchase bill (see src/imageStore.ts), added deliberately post-lock
  serialNumber?: string;
  totalKm: number; // stored, updated on ride insert/edit/delete
}

interface Component {
  id: string;
  bikeId: string;
  type: ComponentType;
  installDate: string;
  installOdometerKm: number; // bike's totalKm at install time
  status: ComponentStatus;
  retiredDate?: string;
  accumulatedKm: number; // stored, updated on ride insert/edit/delete
  expectedLifespanKm: number; // defaults per type, user-editable
}

interface RideEntry {
  id: string;
  bikeId: string;
  date: string;
  distanceKm: number;
  notes?: string;
}

interface MaintenanceLogEntry {
  id: string;
  bikeId: string;
  componentId?: string; // null if bike-level, e.g. full tune-up
  date: string;
  description: string;
  notes?: string;
  cost?: number;
}

const DEFAULT_LIFESPAN_KM: Record<ComponentType, number> = {
  chain: 2000,
  tires_front: 3000,
  tires_rear: 3000,
  brake_pads_front: 1500,
  brake_pads_rear: 1500,
};

type ComponentWearStatus = 'fine' | 'due_soon' | 'overdue';

function getWearStatus(component: Component): ComponentWearStatus {
  const ratio = component.accumulatedKm / component.expectedLifespanKm;
  if (ratio >= 1) return 'overdue';
  if (ratio >= 0.8) return 'due_soon';
  return 'fine';
}
```

## Core business rules (already decided, do not relitigate)

- A ride's km is added to **every currently-active component on that bike**, not selectively.
- `accumulatedKm` and `Bike.totalKm` are **stored and updated on ride insert/edit/delete**, not computed on the fly. Edits/deletes apply a delta (old value subtracted, new value added), not a full recompute.
- Retiring a component does **not** overwrite it. It sets `status: 'retired'` and `retiredDate`, then creates a **new** Component record for the replacement, with `installOdometerKm` set to the bike's current `totalKm`.
- Only currently-active components get updated by a ride, regardless of the ride's date (no retroactive logic for backdated rides against already-retired parts).
- Wear status is **derived**, never stored, always computed from `accumulatedKm / expectedLifespanKm`.

## Design reference

Figma file: https://www.figma.com/design/U5CgK5yNo03ptTf4VFTOrK (BetaGamma team)

Six screens, all built and colored: Bike List, Bike Detail, Log a Ride, Component Detail, Add Maintenance, Add/Edit Bike.

Palette (bound to Figma variables, check the file for current values, don't hardcode from memory):
- accent: navy `#2E3B6E`
- header/page background: sage `#C8D9D4`
- content surface: white
- wear status: green (fine) / amber (due soon) / red (overdue), kept visually separate from the brand palette

## Conventions

- No em dashes in any generated text (code comments, commit messages, docs).
- All displayed numbers go through `formatNumber` in `src/format.ts`: comma thousands separator, dot decimal, max 2 decimals, pinned to en-US. Never render a raw number or a bare `.toLocaleString()` in the UI.
- All displayed dates go through `formatDate` / `formatMonthYear` / `formatLongDate` in `src/format.ts` (all en-US, parsed at local midnight). Never render a raw ISO date string or a per-file date formatter. `<input type="date">` values stay ISO.
- Small, isolated commits over bundled changes.
- Plan mode before structural edits.
- Specific, non-generic commit messages.
- 2-attempt debugging cap: if the same bug isn't fixed after 2 attempts, stop and check for an upstream/known issue before continuing to iterate.

## Backlog (explicitly out of scope for v1, do not build unless asked)

- Cost tracking / total cost of ownership view
- GPS route mapping (would reuse D3/topojson skills from Missing Migrants project)
- Shareable read-only resale-trust export
- Dynamic resale price estimation
- Strava/Health Connect/Apple HealthKit auto-sync (Strava is now a paid API as of June 2026)
- Tappable bike diagram for quick component logging
- Staleness indicator (show a neutral state instead of a wear-status color when no ride has been logged in ~2-3 weeks) — worth pulling into v1 if it's cheap, otherwise first thing in v1.5
- Dream bike wishlist + savings tracker (would need its own schema entirely, unrelated to owned-bike tracking)

## Next step

Scaffold the Vite + React + TypeScript project, set up the PWA plugin, and create the data layer (types + the ride-insert/adjust logic) as the first working code, before touching any screens.
