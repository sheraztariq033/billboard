---
name: database-cost-optimization
description: Database query optimization, index tuning, KV read-through caching, Drizzle batch queries, connection pooling, payload pagination, and server resource/cost reduction for high-throughput edge web apps.
---

# Database Cost Optimization & Resource Minimization Skill

This skill provides mandatory optimization rules to minimize database read/write queries, eliminate unnecessary server CPU cycles, prevent expensive N+1 queries, and reduce infrastructure costs on Cloudflare D1/SQLite/PostgreSQL platforms.

## Core Optimization Rules

1. **Covering Indexes**: Always create indexes for foreign keys and frequently queried columns (`WHERE`, `ORDER BY`, `JOIN` fields).
2. **Read-Through Caching**: Cache expensive DB read results in edge KV or memory with sensible TTLs to avoid hitting the database for repetitive requests.
3. **Batching over Iterative Queries**: Never run DB queries inside `for` loops (N+1 query anti-pattern). Use batch queries (`drizzle.batch(...)` or SQL `IN (...)`).
4. **Select Column Filtering**: Never select `*` when only specific columns are needed. Minimize returned byte payload over the wire.
5. **Cursor-Based Pagination**: Use `WHERE id > ? LIMIT 20` instead of `OFFSET` pagination, which degrades performance as dataset size grows.

---

## 1. D1 / SQLite Indexing Best Practices

```sql
-- Always index join keys and filter conditions
CREATE INDEX IF NOT EXISTS idx_org_members_user ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
```

---

## 2. Preventing N+1 Queries with Drizzle Batching

### ❌ Anti-Pattern: N+1 DB Calls in Loop (High Cost & Slow)
```ts
// DO NOT DO THIS: Executes N separate database queries!
const users = await db.select().from(usersTable);
for (const user of users) {
  user.posts = await db.select().from(postsTable).where(eq(postsTable.userId, user.id));
}
```

### ✅ Optimized Pattern: Single Batch Query (Minimizes Cost)
```ts
// OPTIMIZED: Fetches all related records in a single batch query!
const userIds = users.map(u => u.id);
const allPosts = await db.select().from(postsTable).where(inArray(postsTable.userId, userIds));

// Group posts in memory (0 extra DB reads)
const postsByUserId = allPosts.reduce((acc, post) => {
  (acc[post.userId] = acc[post.userId] || []).push(post);
  return acc;
}, {} as Record<string, typeof allPosts>);
```

---

## 3. Read-Through KV Caching Middleware

Reduce D1 database reads by up to 90% using stale-while-revalidate KV caching:

```ts
import { MiddlewareHandler } from 'hono';

export function kvCacheMiddleware(ttlSeconds = 300): MiddlewareHandler {
  return async (c, next) => {
    if (c.req.method !== 'GET') return next();

    const cacheKey = `cache:${c.req.url}`;
    const cachedResponse = await c.env.KV_CACHE.get(cacheKey, 'text');

    if (cachedResponse) {
      c.header('X-Cache-Status', 'HIT');
      c.header('Content-Type', 'application/json');
      return c.body(cachedResponse);
    }

    await next();

    if (c.res.status === 200) {
      const bodyText = await c.res.clone().text();
      c.executionCtx.waitUntil(
        c.env.KV_CACHE.put(cacheKey, bodyText, { expirationTtl: ttlSeconds })
      );
      c.header('X-Cache-Status', 'MISS');
    }
  };
}
```

---

## 4. Efficient Cursor-Based Pagination

```ts
import { gt, asc } from 'drizzle-orm';

export async function fetchPaginatedItems(db: any, lastSeenId?: string, limit = 20) {
  return db
    .select({
      id: items.id,
      title: items.title,
      createdAt: items.createdAt,
    })
    .from(items)
    .where(lastSeenId ? gt(items.id, lastSeenId) : undefined)
    .orderBy(asc(items.id))
    .limit(limit);
}
```
