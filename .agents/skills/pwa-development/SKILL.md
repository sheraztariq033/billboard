---
name: pwa-development
description: Standard operating procedures and architecture for Progressive Web Apps (PWAs), including Web App Manifest configuration, Service Worker caching strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate), offline fallbacks, install prompt UI, and push notifications.
---

# Progressive Web App (PWA) Development Skill

This skill provides expert guidelines and boilerplate patterns for creating high-performance, installable, offline-capable Progressive Web Applications (PWAs) in React and modern JavaScript.

## Core PWA Requirements

Every PWA must fulfill the following 4 foundational requirements:
1. **HTTPS / Secure Context**: Served over HTTPS or `localhost`.
2. **Web App Manifest (`manifest.webmanifest` or `manifest.json`)**: Configured with valid app identity, icons, theme colors, and display modes.
3. **Service Worker (`sw.js`)**: Registered with appropriate caching strategies and offline fallback handling.
4. **Responsive & Fast UX**: Mobile-first design, fast initial load, and touch-optimized navigation.

---

## 1. Web App Manifest Setup

Place `manifest.webmanifest` in the `/public` directory (or use `vite-plugin-pwa` manifest config):

```json
{
  "short_name": "App",
  "name": "Progressive Web Application",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "background_color": "#090d16",
  "theme_color": "#090d16",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/"
}
```

Include meta tags in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#090d16" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="App" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

---

## 2. Service Worker Caching Strategies

Use Workbox or explicit Service Worker handlers based on resource types:

- **StaleWhileRevalidate**: Ideal for dynamic static assets (CSS, JS bundle, UI assets). Serves from cache immediately while updating from network in background.
- **CacheFirst**: Ideal for versioned static assets, fonts, and images. Serves from cache, falls back to network.
- **NetworkFirst**: Ideal for real-time APIs where fresh data is critical. Attempts network fetch, falls back to cached response if offline.
- **NetworkOnly / CacheOnly**: For specific authentication or tracking calls.

### Vite PWA Setup (`vite.config.ts`)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'React PWA App',
        short_name: 'PWA',
        theme_color: '#090d16',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 86400 }
            }
          }
        ]
      }
    })
  ]
});
```

---

## 3. Install Prompt Component (`usePWAInstall.ts`)

Capture `beforeinstallprompt` event and trigger custom UI install prompt:

```tsx
import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return { isInstallable, installPWA };
}
```

---

## 4. Service Worker Update Banner

Notify users when a new version of the app is available:

```tsx
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3">
      <span>New update available!</span>
      <button 
        onClick={() => updateServiceWorker(true)}
        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium rounded-lg transition"
      >
        Reload
      </button>
      <button 
        onClick={() => setNeedRefresh(false)}
        className="px-2 py-1 text-slate-400 hover:text-white text-sm"
      >
        Dismiss
      </button>
    </div>
  );
}
```
