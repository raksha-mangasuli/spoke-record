# Spoke Record

A bike maintenance and ride tracking PWA. Tracks component-level wear (chain, tires, brake pads) based on accumulated kilometers, not calendar time.

## Local development

```bash
npm install
npm run dev
```

Open the printed localhost URL. Data is stored in the browser's localStorage, nothing leaves your device.

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a new GitHub repo named `spoke-record` (or update `base` in `vite.config.ts` and `start_url`/`icons` paths in the manifest if you use a different name).
2. Push this project to the `main` branch.
3. In the repo settings, go to **Pages**, and under **Build and deployment -> Source**, select **GitHub Actions**.
4. Push to `main` (or re-run the workflow manually from the Actions tab). The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.
5. Once it finishes, the app is live at `https://<your-username>.github.io/spoke-record/`.

## What's implemented (v1)

- Bike list, bike detail, log a ride, component detail, add maintenance, add/edit bike
- Component-level wear tracking (fine / due soon / overdue at 80%/100% of expected lifespan)
- Ride logging updates the bike's total km and every active component's accumulated km
- Retiring a component creates a new component record rather than overwriting history
- localStorage persistence, works offline once loaded (PWA)

## Deliberately not in v1 (see CLAUDE.md backlog)

Cost tracking, GPS route mapping, resale export, Health Connect/Strava sync, tappable bike diagram, staleness indicator, wishlist/savings tracker.
