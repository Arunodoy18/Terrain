# ITADMS

Integrated Terrain-Aware Defensive Mobility System.

ITADMS is a military-themed single-page command dashboard built with React, Vite, and Tailwind CSS. It combines live tactical visualization, terrain stability monitoring, route risk awareness, and an alert-first operator feed in one terminal-style interface.

## Core Highlights

- Tactical dark UI with CRT scanline effect and military green/amber accents
- Real-time top-down sensor simulation on HTML5 canvas
- Dynamic stability risk engine with CRITICAL escalation hooks
- Route Risk Map with animated convoy progress and zone-based alerting
- Threat Intel panel with deterministic rotating mission assessments (demo-safe)
- Auto-scrolling AlertFeed with severity colors and bounded history

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- JavaScript (ESM)

## System Layout

1. Top navbar with mission identity and active status
2. Three-column tactical grid:
- SensorView
- StabilityPanel
- ThreatIntel
3. Full-width Route Risk Map panel below the main grid
4. Full-width AlertFeed panel at the bottom

## Module Overview

### SensorView

- Canvas-based top-down vehicle simulation
- Gorge zones on both edges
- Three full 360-degree pulsing sensor rings centered on vehicle
- Periodic incoming obstacles and proximity alert transitions
- Speed drop animation on DANGER
- Emits alert changes upward to global alert bus

### StabilityPanel

- Interactive sliders for gradient, wetness, and speed
- Slip risk formula:

$$
slipRisk = (gradient \times 0.4) + (wetness \times 0.4) + (speed \times 0.2)
$$

- Status bands: SAFE, CAUTION, CRITICAL
- Emits DANGER alert when transitioning into CRITICAL

### ThreatIntel

- `GENERATE MISSION INTEL` action with loading indicator and typewriter output
- Uses 3 rotating hardcoded tactical assessments for 100% demo reliability
- Outputs exactly 5 labeled lines per assessment:
- `TERRAIN`
- `THREAT`
- `VISIBILITY`
- `RECOMMENDATION`
- `STATUS`

### RouteRiskMap

- SVG winding mountain route from bottom to top
- Live animated vehicle marker moving along path
- Zone overlays:
- GREEN: `CLEAR KM 1-7`
- AMBER: `CAUTION - FOG ZONE KM 8-12`
- RED: `HIGH RISK - ATGM CORRIDOR KM 14-18`
- Emits `WARNING` on AMBER entry and `DANGER` on RED entry

### AlertFeed

- Receives centralized alert stream from all modules
- Auto-scrolls to newest event
- Severity coloring:
- `DANGER` red
- `WARNING` amber
- `CAUTION` yellow
- `INFO` green
- Retains only latest 20 alerts

## Quick Start

```bash
npm install
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Demo Reliability Notes

- Threat intel is intentionally hardcoded and rotated to avoid CORS/network failures during presentations.
- This ensures consistent output quality and no mid-demo API dependency risk.

## Project Structure

```text
itadms-mvp/
	src/
		components/
			SensorView.jsx
			StabilityPanel.jsx
			ThreatIntel.jsx
			RouteRiskMap.jsx
			AlertFeed.jsx
		App.jsx
		index.css
		main.jsx
```

## Roadmap

- Optional secure backend API mode toggle for live model inference
- Persistent alert/event storage and replay timeline
- Operator role modes and configurable rules of engagement
- Test coverage for simulation and alert-emission flows

## License

This repository follows the license terms in the root `LICENSE` file.
