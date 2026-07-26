---
name: offline-first-pwa-architecture
description: Architecture patterns for offline-first React PWAs using IndexedDB (idb/Dexie), optimistic UI updates, background synchronization, offline data queueing, and network connectivity status indicators.
---

# Offline-First PWA Architecture Skill

This skill provides patterns and data synchronization structures for building reliable, resilient offline-first React Progressive Web Applications.

## Core Offline Architecture Strategy

1. **Local-First Writes**: When the user performs an action (create, update, delete), write immediately to local IndexedDB storage and update the React UI state optimistically.
2. **Sync Queue**: Append actions to an outbox queue stored in IndexedDB.
3. **Background Reconciler**: Automatically drain and sync the outbox queue with the backend API when the network is online.
4. **Conflict Resolution**: Use timestamp-based Last-Write-Wins (LWW) or explicit conflict flags.

---

## 1. Network Status Hook (`useNetworkStatus.ts`)

```ts
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

## 2. Offline Network Banner Component

```tsx
import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const OfflineStatusBanner: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 flex items-center justify-between border-b border-amber-500/50 shadow-md">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You are currently offline. Changes will sync automatically once reconnected.</span>
      </div>
    </div>
  );
};
```

---

## 3. IndexedDB Outbox Sync Queue (`offlineStore.ts`)

```ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SyncItem {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  body: any;
  timestamp: number;
}

interface AppDBSchema extends DBSchema {
  outbox: {
    key: string;
    value: SyncItem;
    indexes: { 'by-timestamp': number };
  };
  cache: {
    key: string;
    value: { id: string; data: any; updatedAt: number };
  };
}

let dbPromise: Promise<IDBPDatabase<AppDBSchema>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AppDBSchema>('pwa-offline-db', 1, {
      upgrade(db) {
        const outboxStore = db.createObjectStore('outbox', { keyPath: 'id' });
        outboxStore.createIndex('by-timestamp', 'timestamp');
        db.createObjectStore('cache', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

export async function enqueueOfflineAction(url: string, method: 'POST' | 'PUT' | 'DELETE', body: any) {
  const db = await getDB();
  const item: SyncItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url,
    method,
    body,
    timestamp: Date.now(),
  };
  await db.put('outbox', item);
}

export async function flushOutboxQueue() {
  if (!navigator.onLine) return;
  const db = await getDB();
  const items = await db.getAllFromIndex('outbox', 'by-timestamp');

  for (const item of items) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.body),
      });

      if (response.ok) {
        await db.delete('outbox', item.id);
      }
    } catch (err) {
      console.warn('Failed to sync item:', item, err);
      break; // Pause queue processing if network request fails
    }
  }
}
```
