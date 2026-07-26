import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const creators = new Hono<{ Bindings: Bindings }>();

// POST /api/creators/calculate-rate - Algorithmic Rate Card Engine
// Cost Per Reel = (Baseline CPM * (Avg Views / 1000)) * (1 + Engagement Rate %) * Tier Multiplier
creators.post('/calculate-rate', async (c) => {
  const body = await c.req.json();
  const avgViews = parseInt(body.avgViews || '10000');
  const engagementRatePct = parseFloat(body.engagementRatePct || '5.5');
  const followerCount = parseInt(body.followerCount || '50000');
  const niche = body.niche || 'FOOD'; // Tech & Finance higher CPM

  const baselineCpm = niche === 'TECH' || niche === 'FINANCE' ? 350 : 200; // PKR CPM
  const tierMultiplier = followerCount > 300000 ? 1.5 : followerCount > 50000 ? 1.2 : 1.0;

  const baseCost = (baselineCpm * (avgViews / 1000));
  const engagementBonus = 1 + (engagementRatePct / 100);
  const calculatedRatePkr = Math.round(baseCost * engagementBonus * tierMultiplier);

  return c.json({
    data: {
      avgViews,
      engagementRatePct,
      followerCount,
      niche,
      baselineCpmPkr: baselineCpm,
      calculatedRatePerPostPkr: Math.max(calculatedRatePkr, 5000), // Min 5,000 PKR per reel
    }
  });
});

// GET /api/creators - List All Verified Social Creators
creators.get('/', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const results = await db.select().from(schema.creatorProfiles);

  return c.json({ count: results.length, data: results });
});

export default creators;
