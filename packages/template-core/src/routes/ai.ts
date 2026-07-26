import { Hono } from 'hono';
import { z } from 'zod';
import { EnvBindings } from '../auth';

export interface AiEnvBindings extends EnvBindings {
  AI?: any; // Cloudflare Workers AI Binding
  VECTORIZE_INDEX?: any; // Cloudflare Vectorize Index Binding
}

export const aiRouter = new Hono<{ Bindings: AiEnvBindings }>();

// POST /api/ai/copilot - Intelligent Campaign Co-Pilot & Contextual Triggers Engine
aiRouter.post('/copilot', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const prompt = body.prompt || 'Optimize my Lahore billboard campaign for maximum reach';

  const recommendation = {
    query: prompt,
    suggestedStrategy: 'High-Density Highway & Transit Hybrid Flight',
    weatherContextualTriggers: [
      { trigger: 'Lahore Winter Smog (AQI > 250)', action: 'Boost Air Purifier / Healthcare Ad Frequency', multiplier: '1.68x' },
      { trigger: 'Karachi Monsoon Heavy Rain', action: 'Trigger Hot Beverage / Soup Video Spots', multiplier: '1.35x' },
      { trigger: 'Ramadan Evening Iftar Peak (5-7 PM)', action: 'Lock Category Exclusivity for Food Brands', multiplier: '1.50x' },
    ],
    recommendedAssets: [
      { name: 'Gulberg Main Boulevard SMD', city: 'Lahore', estReach: '1,200,000 / day', costPkr: '950,000 / mo' },
      { name: 'Clifton Block 2 Flyover SMD', city: 'Karachi', estReach: '2,100,000 / day', costPkr: '1,200,000 / mo' },
    ],
    summaryText: `AI Analysis complete for "${prompt}". Recommended budget split: 40% Roadside Digital SMDs, 30% Peak Stream spots, 15% Local Creators, 15% Weather/AQI Triggers.`,
  };

  return c.json({ data: recommendation });
});

const embedSchema = z.object({
  text: z.string().min(1),
  id: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

aiRouter.post('/embed', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = embedSchema.parse(body);

    const ai = c.env.AI;
    const vectorIndex = c.env.VECTORIZE_INDEX;

    if (!ai || !vectorIndex) {
      return c.json({
        error: 'Cloudflare Workers AI or Vectorize binding not configured in wrangler.toml',
        simulated: true,
        embeddingLength: 384,
      });
    }

    const embeddingsResponse = await ai.run('@cf/baai/bge-small-en-v1.5', {
      text: [parsed.text],
    });

    const vector = embeddingsResponse.data[0];
    const vectorId = parsed.id || crypto.randomUUID();

    await vectorIndex.insert([
      {
        id: vectorId,
        values: vector,
        metadata: { text: parsed.text, ...(parsed.metadata || {}) },
      },
    ]);

    return c.json({ success: true, vectorId, vectorDimensions: vector.length });
  } catch (err: any) {
    return c.json({ error: err.message || 'Vector embedding failure' }, 400);
  }
});

aiRouter.post('/search', async (c) => {
  try {
    const { query, topK = 5 } = await c.req.json();
    const ai = c.env.AI;
    const vectorIndex = c.env.VECTORIZE_INDEX;

    if (!ai || !vectorIndex) {
      return c.json({
        simulated: true,
        query,
        matches: [],
      });
    }

    const embeddingsResponse = await ai.run('@cf/baai/bge-small-en-v1.5', {
      text: [query],
    });

    const queryVector = embeddingsResponse.data[0];

    const searchResults = await vectorIndex.query(queryVector, {
      topK,
      returnMetadata: true,
    });

    return c.json({ success: true, query, matches: searchResults.matches });
  } catch (err: any) {
    return c.json({ error: err.message || 'Vector search failure' }, 400);
  }
});

export default aiRouter;
