import { Hono } from 'hono';

const pricing = new Hono();

// POST /api/pricing/calculate - Demand-Based Surge & Seasonal Dynamic Pricing Engine
pricing.post('/calculate', async (c) => {
  const body = await c.req.json();
  const baseDailyRatePkr = Number(body.baseDailyRatePkr || 35000);
  const occupancyRatePct = Number(body.occupancyRatePct || 85); // High occupancy triggers surge
  const isRamadanSeason = Boolean(body.isRamadanSeason || true);

  let surgeMultiplier = 1.0;
  if (occupancyRatePct > 80) surgeMultiplier += 0.20; // +20% surge pricing when occupancy > 80%
  if (isRamadanSeason) surgeMultiplier += 0.15; // +15% Ramadan prime season premium

  const dynamicDailyRatePkr = Math.round(baseDailyRatePkr * surgeMultiplier);
  const totalSurgeIncreasePkr = dynamicDailyRatePkr - baseDailyRatePkr;

  return c.json({
    baseDailyRatePkr,
    occupancyRatePct,
    isRamadanSeason,
    surgeMultiplier,
    dynamicDailyRatePkr,
    totalSurgeIncreasePkr,
    appliedRules: [
      occupancyRatePct > 80 ? 'Demand Surge: High Occupancy >80% (+20%)' : 'Standard Demand',
      isRamadanSeason ? 'Seasonal Premium: Ramadan Peak (+15%)' : 'Standard Season',
    ],
  });
});

export default pricing;
