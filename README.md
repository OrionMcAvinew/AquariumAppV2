# AquaManager v2 🐠

A modern, full-featured aquarium management app built with React, TypeScript, Tailwind CSS, Recharts, and Zustand.

## Features

### Core Tracking
- **Multi-tank profiles** — Freshwater, Saltwater, Reef, Planted, Brackish
- **Water parameter logging** — pH, Ammonia, Nitrite, Nitrate, Temperature, Salinity, GH, KH, Phosphate, DO
- **Tank health score** — 0–100 score based on current parameter ranges
- **Parameter trend charts** — Line charts with safe-range reference lines

### Alerts & Safety
- **Automatic alerts** — Warning and critical alerts triggered by out-of-range parameters
- **Safe ranges** — Per-tank-type ranges (freshwater, reef, saltwater, etc.)
- **Alert dashboard** — Active alerts surfaced prominently across the app

### Maintenance
- **Recurring tasks** — Water changes, filter cleaning, feeding, parameter testing
- **Overdue tracking** — Visual indicators for overdue and upcoming tasks
- **One-tap complete** — Mark tasks done and auto-schedule the next occurrence

### Database
- **20 fish species** — Care guides, tank requirements, compatibility info
- **15 plant species** — Light, CO₂, placement, and care requirements
- **Searchable & filterable** — By difficulty, tank type, search term

### UI / UX
- Responsive — works on mobile and desktop
- Sidebar nav (desktop) + bottom nav (mobile)
- Ocean/teal color theme with gradient tank cards

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| State | Zustand + localStorage persistence |
| Charts | Recharts |
| Icons | Heroicons |
| Routing | React Router v6 |
| Date utils | date-fns |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app seeds demo data automatically on first load (3 sample tanks with readings).

## Project Structure

```
src/
├── components/       # Reusable UI components
├── data/             # Fish/plant databases and sample data
├── pages/            # All page components
├── store/            # Zustand store with all state and actions
├── types/            # TypeScript type definitions
└── utils/            # Parameter ranges and utilities
```