# Farmstellar PWA — Setup & Test

This repository includes a minimal PWA setup for Farmstellar (Next.js app router).

Quick steps to run locally:

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open the app in a Chrome-based browser on your desktop for initial checks:

- Visit: `http://localhost:3000`
- Confirm the manifest is reachable at: `http://localhost:3000/manifest.json`
- Confirm the service worker is registered in DevTools > Application > Service Workers.

Testing Add-to-Home-Screen (Android / Chrome):

1. Use an Android device on the same network, or use Chrome DevTools' device toolbar and "Remote devices".
2. Open `http://<your-ip>:3000` (or use `localhost` with port forwarding).
3. Wait ~30 seconds on the site — the custom install banner will appear (or click the Install CTA if you set `localStorage['farmstellar_prompt']='1'`).
4. Click `Install` on the custom banner — the browser prompt will show. Accept to install.

Notes and best practices included in this boilerplate:

- Offline-first: `public/sw.js` precaches the app shell (`/`, `/login`, `/dashboard`) and serves navigation requests from cache first.
- Manifest: `public/manifest.json` configured with `start_url: /login`, theme color `#4CAF50`, and placeholder icons.
- Install UX: `components/PWAProvider.jsx` handles `beforeinstallprompt`, shows a custom install banner after 30s, and triggers the browser prompt.
- Low-bandwidth: `next.config.ts` prefers modern compressed image formats (AVIF/WebP) when optimizing images.

Caveats & next steps for a production-ready PWA:

- Replace placeholder icons in `public/icons/` with proper PNG/WEBP assets at required sizes (192x192, 512x512).
- Improve SW caching strategy for API responses and images (use Workbox for more robust strategies).
- Add server-side headers and HTTPS in production (A2HS requires secure context).
- Consider push notifications and background sync for a richer offline experience.

If you want, I can:

- Add Workbox + more advanced caching strategies.
- Generate raster PNG icons from the SVGs and include them.
- Add image component examples with `next/image` configuration and fallback behavior for low-bandwidth.
