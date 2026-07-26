import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const campaigns = new Hono<{ Bindings: Bindings }>();

// POST /api/campaigns/package - AI Smart Budget Packager Algorithm
campaigns.post('/package', async (c) => {
  const body = await c.req.json();
  const totalBudget = parseInt(body.totalBudgetPkr);
  const city = body.targetCity || 'Lahore';

  if (!totalBudget || totalBudget <= 0) {
    return c.json({ error: 'Valid budget in PKR required' }, 400);
  }

  // Algorithmic Budget Packaging Breakdown
  // 40% Roadside OOH/DOOH, 30% TV/Digital Stream, 15% Social Creators, 10% Transit, 5% Retail Shelves
  const oohBudget = Math.round(totalBudget * 0.40);
  const tvBudget = Math.round(totalBudget * 0.30);
  const creatorBudget = Math.round(totalBudget * 0.15);
  const transitBudget = Math.round(totalBudget * 0.10);
  const retailBudget = Math.round(totalBudget * 0.05);

  const packagingBreakdown = {
    totalBudgetPkr: totalBudget,
    targetCity: city,
    allocations: [
      {
        channel: 'Roadside OOH & DOOH SMDs',
        percentage: 40,
        budgetPkr: oohBudget,
        suggestedAssets: [
          { name: 'Main Boulevard Johar Town SMD Screen', duration: '15 Days', estImpressions: '1,200,000' },
          { name: 'Canal Road Cantilever Billboard', duration: '30 Days', estImpressions: '2,500,000' }
        ]
      },
      {
        channel: 'Mainstream TV & Digital Streams',
        percentage: 30,
        budgetPkr: tvBudget,
        suggestedAssets: [
          { name: 'Tamasha Cricket Stream Video Spot', duration: '10 Spots/Day', estImpressions: '3,000,000' },
          { name: 'Prime Time News Ticker Placement', duration: '7 Days', estImpressions: '4,500,000' }
        ]
      },
      {
        channel: 'Organic Social Media Creators',
        percentage: 15,
        budgetPkr: creatorBudget,
        suggestedAssets: [
          { name: '10 Local Food & Lifestyle Micro-Creators', format: 'Instagram Reel + TikTok Review', estViews: '600,000' }
        ]
      },
      {
        channel: 'Transit & Bus Fleet Wraps',
        percentage: 10,
        budgetPkr: transitBudget,
        suggestedAssets: [
          { name: '25 Daewoo Bus Food Box Branding Wraps', duration: '30 Days', estImpressions: '800,000' }
        ]
      },
      {
        channel: 'Retail Karyana Store Shelf Media',
        percentage: 5,
        budgetPkr: retailBudget,
        suggestedAssets: [
          { name: '50 Grocery Store Premium Counter Displays', duration: '30 Days', estImpressions: '400,000' }
        ]
      }
    ],
    totalEstimatedImpressions: '12,500,000+'
  };

  return c.json({ data: packagingBreakdown });
});

// POST /api/campaigns - Execute Campaign Creation & Asset Booking
campaigns.post('/', async (c) => {
  const body = await c.req.json();
  const db = drizzle(c.env.DB, { schema });

  const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const newCampaign = {
    id: campaignId,
    advertiserId: body.advertiserId || 'user_default',
    title: body.title,
    totalBudgetPkr: parseInt(body.totalBudgetPkr),
    startDate: new Date(body.startDate || Date.now()),
    endDate: new Date(body.endDate || Date.now() + 30 * 86400 * 1000),
    targetCity: body.targetCity || 'Lahore',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(schema.campaigns).values(newCampaign);

  return c.json({ message: 'Campaign executed successfully', data: newCampaign }, 201);
});

export default campaigns;
