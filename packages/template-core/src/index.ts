import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRouter } from './routes/health';
import { storageRouter } from './routes/storage';
import { stripeRouter } from './routes/stripe';
import { aiRouter } from './routes/ai';
import assetsRouter from './routes/assets';
import campaignsRouter from './routes/campaigns';
import creatorsRouter from './routes/creators';
import verificationRouter from './routes/verification';
import analyticsRouter from './routes/analytics';
import creativesRouter from './routes/creatives';
import docsRouter from './routes/docs';
import taxRouter from './routes/tax';
import currencyRouter from './routes/currency';
import commissionRouter from './routes/commission';
import pricingRouter from './routes/pricing';
import visionRouter from './routes/vision';
import searchRouter from './routes/search';

import { rateLimiter } from './middleware/rate-limit';
import { requestTracing } from './middleware/tracing';
import { initAuth, EnvBindings } from './auth';

const app = new Hono<{ Bindings: EnvBindings }>();

// 1. Tracing & Structured Logging Middleware
app.use('*', requestTracing());

// 2. CORS Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-Request-ID'],
  maxAge: 600,
  credentials: true,
}));

// 3. Global Rate Limiter (100 req/min per IP)
app.use('/api/*', rateLimiter({ limit: 100, windowSeconds: 60 }));

// 4. Better-Auth Handler Mount
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  const auth = initAuth(c.env);
  return auth.handler(c.req.raw);
});

// 5. Public OMNI-GRID Ad-Tech API Routes
app.route('/api/health', healthRouter);
app.route('/api/assets', assetsRouter);
app.route('/api/campaigns', campaignsRouter);
app.route('/api/creators', creatorsRouter);
app.route('/api/verification', verificationRouter);
app.route('/api/analytics', analyticsRouter);
app.route('/api/creatives', creativesRouter);
app.route('/api/docs', docsRouter);
app.route('/api/tax', taxRouter);
app.route('/api/currency', currencyRouter);
app.route('/api/commission', commissionRouter);
app.route('/api/pricing', pricingRouter);
app.route('/api/vision', visionRouter);
app.route('/api/search', searchRouter);

// 6. Stripe & Protected Routes
app.route('/api/stripe', stripeRouter);
app.route('/api/storage', storageRouter);
app.route('/api/ai', aiRouter);

// 7. Root Route
app.get('/', (c) => {
  return c.json({
    name: 'OMNI-GRID PAKISTAN Edge Platform API',
    status: 'running',
    version: '1.0.0',
    platform: 'SparrowBase Edge Engine',
    endpoints: [
      '/api/health',
      '/api/assets',
      '/api/campaigns/package',
      '/api/creators/calculate-rate',
      '/api/verification/upload',
      '/api/analytics',
      '/api/creatives',
      '/api/docs/openapi.json',
      '/api/tax/calculate',
      '/api/currency/rates',
      '/api/commission/calculate',
      '/api/pricing/calculate',
      '/api/vision/analyze',
      '/api/search/semantic',
    ],
  });
});

export default app;
