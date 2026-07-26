---
name: sparrowbase-backend
description: Architecture, setup, and code patterns for using SparrowBase edge-native backend (Cloudflare Workers + Hono.js + D1 SQLite + Drizzle ORM + R2 + KV + Vectorize + Better-Auth) for zero-cost $0/month serverless SaaS backend.
---

# SparrowBase Edge Backend Architecture Skill

SparrowBase is an opinionated, edge-native backend platform designed to run multi-tenant SaaS applications on Cloudflare's **$0/month free tier** (100k Worker requests/day, 5M D1 reads/day, 10GB R2 storage).

## Core Technology Stack

- **HTTP Framework**: Hono.js (`hono`) running on Cloudflare Workers edge.
- **Database Layer**: Cloudflare D1 (Serverless SQLite) with Drizzle ORM (`drizzle-orm/d1`).
- **Object Storage**: Cloudflare R2 (S3-compatible bucket) for user uploads & assets.
- **Cache & Rate Limiting**: Cloudflare KV (`env.KV_CACHE`) for response caching & session lookup.
- **Authentication**: Better-Auth with Web Crypto and D1 session store.
- **Vector Search & AI**: Cloudflare Workers AI + Vectorize (`env.VECTOR_INDEX`).

---

## 1. D1 Database Schema & Drizzle ORM (`src/db/schema.ts`)

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('user'),
  createdAt: integer('created_at').notNull(),
});

export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: integer('created_at').notNull(),
});

export const orgMembers = sqliteTable('org_members', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull().references(() => organizations.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').default('member'),
});
```

---

## 2. Hono Edge Router (`src/index.ts`)

```ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';

type Bindings = {
  DB: D1Database;
  KV_CACHE: KVNamespace;
  UPLOADS: R2Bucket;
  AI: any;
};

const app = new Hono<{ Bindings: Bindings }>();

// Global CORS Middleware
app.use('*', cors());

// Health & Diagnostic Endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', region: c.req.raw.cf?.colo || 'edge', timestamp: Date.now() });
});

// D1 Query Endpoint with KV Read-Through Cache
app.get('/api/users/:id', async (c) => {
  const userId = c.req.param('id');
  const cacheKey = `user:${userId}`;

  // 1. Check KV Cache
  const cached = await c.env.KV_CACHE.get(cacheKey, 'json');
  if (cached) {
    return c.json({ source: 'kv-cache', data: cached });
  }

  // 2. Query D1 via Drizzle ORM
  const db = drizzle(c.env.DB, { schema });
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!user) return c.json({ error: 'User not found' }, 404);

  // 3. Populate KV Cache (TTL 5 minutes)
  await c.env.KV_CACHE.put(cacheKey, JSON.stringify(user), { expirationTtl: 300 });

  return c.json({ source: 'd1-database', data: user });
});

export default app;
```

---

## 3. Cloudflare Resources Setup (`wrangler.jsonc` / `wrangler.toml`)

```toml
name = "sparrowbase-backend"
main = "src/index.ts"
compatibility_date = "2024-11-01"

[[d1_databases]]
binding = "DB"
database_name = "sparrowbase-db"
database_id = "your-d1-database-id"

[[kv_namespaces]]
binding = "KV_CACHE"
id = "your-kv-namespace-id"

[[r2_buckets]]
binding = "UPLOADS"
bucket_name = "sparrowbase-uploads"
```
