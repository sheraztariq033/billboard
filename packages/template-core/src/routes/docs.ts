import { Hono } from 'hono';

const docs = new Hono();

// GET /api/docs/openapi.json - OpenAPI 3.0 Specification
docs.get('/openapi.json', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'OMNI-GRID PAKISTAN Edge Platform API',
      version: '1.0.0',
      description: 'Pakistan\'s First Omnichannel Ad-Tech Edge Infrastructure API powered by Cloudflare Workers & Hono',
    },
    servers: [
      { url: 'https://omni-grid-backend.workers.dev', description: 'Cloudflare Edge Production' },
      { url: 'http://localhost:8787', description: 'Local Development Server' },
    ],
    paths: {
      '/api/health': {
        get: {
          summary: 'Edge Engine Health Check',
          responses: { 200: { description: 'Engine operational' } },
        },
      },
      '/api/assets': {
        get: {
          summary: 'List Omnichannel Ad Inventory',
          responses: { 200: { description: 'Array of inventory items' } },
        },
        post: {
          summary: 'Register New Billboard / DOOH Asset',
          responses: { 201: { description: 'Asset registered' } },
        },
      },
      '/api/campaigns/bookings': {
        post: {
          summary: 'Create Campaign Booking & Lock Escrow',
          responses: { 200: { description: 'Booking confirmed' } },
        },
      },
      '/api/creators/calculate-rate': {
        post: {
          summary: 'Calculate Creator CPM Rate Card',
          responses: { 200: { description: 'Calculated rate' } },
        },
      },
      '/api/verification/upload': {
        post: {
          summary: 'Upload Geotagged Proof Photo',
          responses: { 200: { description: 'Proof verified' } },
        },
      },
    },
  });
});

export default docs;
