import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const analytics = new Hono<{ Bindings: Bindings }>();

// GET /api/analytics - Platform & Enterprise Analytics Metrics
analytics.get('/', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const metrics = {
    grossImpressions: 48500000,
    activeBillboardsCount: 19,
    occupancyRatePct: 94.2,
    totalGrossRevenuePkr: 18450000,
    fbrWhtTaxCollectedPkr: 553500, // 3% FBR WHT
    praPstTaxCollectedPkr: 2952000, // 16% PRA PST
    cityBreakdown: [
      { city: 'Lahore', impressions: 22400000, revenuePkr: 8900000, activeDisplays: 9 },
      { city: 'Karachi', impressions: 18100000, revenuePkr: 6800000, activeDisplays: 6 },
      { city: 'Islamabad', impressions: 8000000, revenuePkr: 2750000, activeDisplays: 4 },
    ],
    daypartingPeakHours: [
      { slot: 'Morning Rush (7-11 AM)', sharePct: 32 },
      { slot: 'Evening Rush (5-10 PM)', sharePct: 48 },
      { slot: 'Night Life (7 PM - 1 AM)', sharePct: 20 },
    ],
  };

  return c.json({ data: metrics });
});

export default analytics;
