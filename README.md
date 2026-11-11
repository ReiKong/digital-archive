# The Things I Kept — Digital Archive

An experimental spatial archive built with React, TypeScript, and Vite. Includes 24 original SVG sample objects, an organically scattered infinite-feeling canvas, draggable objects, pan/zoom, and a floating inspect view.

## Get started

```bash
npm install
npm run dev
```

Open the local address shown by Vite (usually http://localhost:5173).

## Controls

- **Drag empty canvas** — pan in any direction.
- **Trackpad two-finger scroll** — pan around the archive.
- **Pinch trackpad / Ctrl + scroll** — zoom around your cursor.
- **Bottom-right + / −** — zoom from the center.
- **Drag object** — move it to a new spot (automatically saved).
- **Click object** — open its enlarged image and story.
- **Escape or click blurred background** — close detail.
- **Left / right arrow keys** — browse objects while detail is open.
- **Crosshair** — return to initial view.
- **Circular arrow** — reset saved positions (requires confirmation).

## Customize

- `src/data.ts` — titles, years, descriptions, positions, rotation, size, layering, and image filenames.
- `public/images/` — bundled example SVGs; replace with photos (PNG/JPEG/WebP) and update each `image` path in `src/data.ts`.
- `src/styles.css` — palette, typography, modal treatment, spacing.
- `src/App.tsx` — drag, click, pan, zoom and persistence logic.

Positions and stack order persist in browser `localStorage` under `the-things-i-kept:v1`. This demo does not have a server, user accounts, or photo upload UI.

## Build

```bash
npm run build
npm run preview
```

The built site is output to `dist/`.
