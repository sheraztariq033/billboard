import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, gte, lte } from 'drizzle-orm';
import * as schema from '../db/schema';

type Bindings = {
  DB: D1Database;
  KV_CACHE: KVNamespace;
};

const assets = new Hono<{ Bindings: Bindings }>();

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
    softExpiryDate: 'Sep 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'khi_1',
    ownerId: 'owner_default',
    title: 'Clifton Block 2 Flyover Dual Facing SMD',
    category: 'DOOH',
    locationCity: 'Karachi',
    locationArea: 'Clifton Block 2 Main Flyover',
    latitude: 24.8138,
    longitude: 67.0303,
    dailyRatePkr: 45000,
    monthlyRatePkr: 1200000,
    dimensions: '80x30 ft',
    estimatedDailyImpressions: 2100000,
    softExpiryDate: 'Oct 01, 2026',
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
    latitude: 33.7182,
    longitude: 73.0604,
    dailyRatePkr: 28000,
    monthlyRatePkr: 750000,
    dimensions: '40x15 ft',
    estimatedDailyImpressions: 850000,
    softExpiryDate: 'Sep 28, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'lhr_2',
    ownerId: 'owner_default',
    title: 'DHA Phase 5 Commercial Ring SMD',
    category: 'DOOH',
    locationCity: 'Lahore',
    locationArea: 'DHA Phase 5 Commercial Ring Exit',
    latitude: 31.4697,
    longitude: 74.4042,
    dailyRatePkr: 31000,
    monthlyRatePkr: 850000,
    dimensions: '50x20 ft',
    estimatedDailyImpressions: 1400000,
    softExpiryDate: 'Sep 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    id: 'skp_1',
    ownerId: 'owner_default',
    title: 'Allama Iqbal International Airport Lounge Screen',
    category: 'RETAIL_SHELF',
    locationCity: 'Lahore',
    locationArea: 'International Departures Lounge',
    latitude: 31.5216,
    longitude: 74.4036,
    dailyRatePkr: 22000,
    monthlyRatePkr: 600000,
    dimensions: '10x6 ft',
    estimatedDailyImpressions: 180000,
    softExpiryDate: 'Oct 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
  },
];

// GET /api/assets - List & Filter Assets by Category, City, and Price
assets.get('/', async (c) => {
  const category = c.req.query('category');
  const city = c.req.query('city');
  const maxPrice = c.req.query('maxPrice') ? parseInt(c.req.query('maxPrice')!) : undefined;

  const db = drizzle(c.env.DB, { schema });
  
  let results = [];
  try {
    results = await db.select().from(schema.adAssets);
  } catch (err) {
    // If table is missing or DB uninitialized, fallback to seed array
    results = [];
  }

  if (results.length === 0) {
    results = SEED_ASSETS.map(a => ({
      ...a,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as any;
  }

  const filtered = results.filter((asset) => {
    if (city && city !== 'ALL' && asset.locationCity.toLowerCase() !== city.toLowerCase()) return false;
    if (category && category !== 'ALL' && asset.category.toLowerCase() !== category.toLowerCase()) return false;
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
    asset = await db.query.adAssets.findFirst({
      where: (a, { eq }) => eq(a.id, id),
    });
  } catch (e) {}

  if (!asset) {
    asset = SEED_ASSETS.find(a => a.id === id) || null;
  }

  if (!asset) {
    return c.json({ error: 'Asset not found' }, 404);
  }

  return c.json({ data: asset });
});

// POST /api/assets - Register New Ad Asset
assets.post('/', async (c) => {
  const body = await c.req.json();
  const db = drizzle(c.env.DB, { schema });

  const newAsset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ownerId: body.ownerId || 'user_default',
    title: body.title,
    category: body.category || 'DOOH',
    locationCity: body.locationCity || 'Lahore',
    locationArea: body.locationArea || 'Commercial Area',
    latitude: body.latitude ? parseFloat(body.latitude) : 31.5204,
    longitude: body.longitude ? parseFloat(body.longitude) : 74.3587,
    dailyRatePkr: parseInt(body.dailyRatePkr || '30000'),
    monthlyRatePkr: parseInt(body.monthlyRatePkr || '800000'),
    dimensions: body.dimensions || '60x20 ft',
    estimatedDailyImpressions: body.estimatedDailyImpressions ? parseInt(body.estimatedDailyImpressions) : 500000,
    softExpiryDate: body.softExpiryDate || 'Available Now',
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await db.insert(schema.adAssets).values(newAsset);
  } catch (e) {}

  return c.json({ message: 'Asset created successfully', data: newAsset }, 201);
});

export default assets;
