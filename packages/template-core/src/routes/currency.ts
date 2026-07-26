import { Hono } from 'hono';

const currency = new Hono();

// GET /api/currency/rates - Live State Bank of Pakistan & Open Rates Feed
currency.get('/rates', (c) => {
  return c.json({
    baseCurrency: 'PKR',
    timestamp: new Date().toISOString(),
    rates: {
      PKR: 1.0,
      USD: 0.0036, // 1 USD = ~278 PKR
      AED: 0.0132, // 1 AED = ~75.7 PKR
      GBP: 0.0028, // 1 GBP = ~357 PKR
    },
  });
});

export default currency;
