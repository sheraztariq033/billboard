import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, gte, lte } from 'drizzle-orm';
import * as schema from '../db/schema';

type Bindings = {
  DB: D1Database;
  KV_CACHE: KVNamespace;
};

const assets = new Hono<{ Bindings: Bindings }>();

// GET /api/assets - List & Filter Assets by Category, City, and Budget
assets.get('/', async (c) => {
  const category = c.req.query('category');
  const city = c.req.query('city') || 'Lahore';
  const maxPrice = c.req.query('maxPrice') ? parseInt(c.req.query('maxPrice')!) : undefined;

  const cacheKey = `assets:${city}:${category || 'all'}:${maxPrice || 'any'}`;
  const cached = await c.env.KV_CACHE?.get(cacheKey, 'json');
  if (cached) {
    return c.json({ source: 'kv-cache', data: cached });
  }

  const db = drizzle(c.env.DB, { schema });
  
  let query = db.select().from(schema.adAssets);
  const results = await query;

  const filtered = results.filter((asset) => {
    if (city && asset.locationCity.toLowerCase() !== city.toLowerCase()) return false;
    if (category && asset.category.toLowerCase() !== category.toLowerCase()) return false;
    if (maxPrice && asset.monthlyRatePkr > maxPrice) return false;
    return true;
  });

  if (c.env.KV_CACHE) {
    await c.env.KV_CACHE.put(cacheKey, JSON.stringify(filtered), { expirationTtl: 180 });
  }

  return c.json({ source: 'd1-database', count: filtered.length, data: filtered });
});

// GET /api/assets/:id - Single Asset Details & Soft-Expiry Window
assets.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const asset = await db.query.adAssets.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });

  if (!asset) {
    return c.json({ error: 'Asset not found' }, 404);
  }

  return c.json({ data: asset });
});

// POST /api/assets - Register New Ad Asset (Vendors / Shopkeepers / Civic Partners)
assets.post('/', async (c) => {
  const body = await c.req.json();
  const db = drizzle(c.env.DB, { schema });

  const newAsset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ownerId: body.ownerId || 'user_default',
    title: body.title,
    category: body.category, // 'OOH' | 'DOOH' | 'RETAIL_SHELF' | 'CIVIC_KIOSK' | 'CAMPUS' | 'TRANSIT' | 'HORECA' | 'TV'
    locationCity: body.locationCity,
    locationArea: body.locationArea,
    latitude: body.latitude ? parseFloat(body.latitude) : null,
    longitude: body.longitude ? parseFloat(body.longitude) : null,
    dailyRatePkr: parseInt(body.dailyRatePkr),
    monthlyRatePkr: parseInt(body.monthlyRatePkr),
    dimensions: body.dimensions || 'Standard',
    estimatedDailyImpressions: body.estimatedDailyImpressions ? parseInt(body.estimatedDailyImpressions) : 50000,
    softExpiryDate: body.softExpiryDate || 'Available Now',
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(schema.adAssets).values(newAsset);

  return c.json({ message: 'Asset created successfully', data: newAsset }, 201);
});

export default assets;
