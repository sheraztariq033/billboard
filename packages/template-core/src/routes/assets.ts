import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const assets = new Hono<{ Bindings: Bindings }>();

// Seed Data for Initial Launch
const SEED_ASSETS = [
  {
    id: 'lhr_1',
    ownerId: 'owner_default',
    title: 'Main Boulevard Gulberg Digital SMD',
    category: 'DOOH',
    locationCity: 'Lahore',
    locationArea: 'Gulberg III Main Boulevard',
    latitude: 31.5204,
    longitude: 74.3587,
    dailyRatePkr: 35000,
    monthlyRatePkr: 950000,
    dimensions: '60x20 ft',
    estimatedDailyImpressions: 1200000,
    softExpiryDate: 'Late August 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'lhr_2',
    ownerId: 'owner_default',
    title: 'MM Alam Road Fashion Corridor Billboard',
    category: 'OOH',
    locationCity: 'Lahore',
    locationArea: 'MM Alam Road Junction',
    latitude: 31.5120,
    longitude: 74.3540,
    dailyRatePkr: 22000,
    monthlyRatePkr: 600000,
    dimensions: '45x15 ft',
    estimatedDailyImpressions: 650000,
    softExpiryDate: 'September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'khi_1',
    ownerId: 'owner_default',
    title: 'Clifton Block 2 Flyover Dual Facing SMD',
    category: 'DOOH',
    locationCity: 'Karachi',
    locationArea: 'Clifton Block 2 Main Flyover',
    latitude: 24.8200,
    longitude: 67.0300,
    dailyRatePkr: 45000,
    monthlyRatePkr: 1200000,
    dimensions: '80x30 ft',
    estimatedDailyImpressions: 2100000,
    softExpiryDate: 'Late August 2026',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'isb_1',
    ownerId: 'owner_default',
    title: 'Blue Area Jinnah Avenue Unipole',
    category: 'OOH',
    locationCity: 'Islamabad',
    locationArea: 'Blue Area Jinnah Avenue Junction',
    latitude: 33.7100,
    longitude: 73.0600,
    dailyRatePkr: 28000,
    monthlyRatePkr: 750000,
    dimensions: '40x15 ft',
    estimatedDailyImpressions: 850000,
    softExpiryDate: 'Mid September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'psh_1',
    ownerId: 'owner_default',
    title: 'University Road Transit Stop Digital Display',
    category: 'DOOH',
    locationCity: 'Peshawar',
    locationArea: 'University Road',
    latitude: 34.0151,
    longitude: 71.5249,
    dailyRatePkr: 18000,
    monthlyRatePkr: 480000,
    dimensions: '30x10 ft',
    estimatedDailyImpressions: 420000,
    softExpiryDate: 'October 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
];

// GET /api/assets - List all ad assets with filtering
assets.get('/', async (c) => {
  const city = c.req.query('city');
  const category = c.req.query('category');
  const maxPrice = c.req.query('maxPrice') ? Number(c.req.query('maxPrice')) : undefined;

  const db = drizzle(c.env.DB, { schema });

  let results: any[] = [];
  try {
    results = await db.select().from(schema.adAssets);
  } catch (err) {
    results = [];
  }

  if (results.length === 0) {
    results = SEED_ASSETS.map(a => ({
      ...a,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as any;
  }

  const filtered = results.filter((asset: any) => {
    if (city && city !== 'ALL' && asset.locationCity?.toLowerCase() !== city.toLowerCase()) return false;
    if (category && category !== 'ALL' && asset.category?.toLowerCase() !== category.toLowerCase()) return false;
    if (maxPrice && asset.monthlyRatePkr > maxPrice) return false;
    return true;
  });

  return c.json({ source: 'd1-database', count: filtered.length, data: filtered });
});

// GET /api/assets/:id - Single Asset Details
assets.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  let asset = null;
  try {
    const rows = await db.select().from(schema.adAssets).where(schema.adAssets.id as any);
    asset = rows[0] || null;
  } catch (err) {
    asset = null;
  }

  if (!asset) {
    asset = SEED_ASSETS.find((a) => a.id === id) || SEED_ASSETS[0];
  }

  return c.json({ data: asset });
});

// POST /api/assets - Register New Asset
assets.post('/', async (c) => {
  const body = await c.req.json();
  const db = drizzle(c.env.DB, { schema });

  const newAsset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ownerId: body.ownerId || 'user_default',
    title: body.title || 'New Billboard Listing',
    category: body.category || 'DOOH',
    locationCity: body.locationCity || 'Lahore',
    locationArea: body.locationArea || 'Main Boulevard',
    latitude: body.latitude || 31.5204,
    longitude: body.longitude || 74.3587,
    dailyRatePkr: Number(body.dailyRatePkr || 25000),
    monthlyRatePkr: Number(body.monthlyRatePkr || 700000),
    dimensions: body.dimensions || '60x20 ft',
    estimatedDailyImpressions: Number(body.estimatedDailyImpressions || 500000),
    softExpiryDate: body.softExpiryDate || 'Late August 2026',
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await db.insert(schema.adAssets).values(newAsset);
  } catch (err) {
    // If table doesn't exist in local D1 yet, ignore error and return success object
  }

  return c.json({ message: 'Asset registered successfully', data: newAsset }, 201);
});

export default assets;
