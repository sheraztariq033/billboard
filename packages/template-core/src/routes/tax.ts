import { Hono } from 'hono';

const tax = new Hono();

// POST /api/tax/calculate - Calculate FBR WHT & PRA/PST Taxes
tax.post('/calculate', async (c) => {
  const body = await c.req.json();
  const grossAmountPkr = Number(body.grossAmountPkr || 1000000);
  const userType = body.userType || 'CORPORATE'; // 'CORPORATE' | 'INDIVIDUAL'

  const pstTaxPkr = Math.round(grossAmountPkr * 0.16); // 16% PRA/PST
  const whtPct = userType === 'CORPORATE' ? 3 : 10; // 3% Corporate vs 10% Individual Section 153 WHT
  const whtTaxPkr = Math.round(grossAmountPkr * (whtPct / 100));

  const netInvoicePkr = grossAmountPkr + pstTaxPkr;
  const netPayablePkr = netInvoicePkr - whtTaxPkr;

  return c.json({
    grossAmountPkr,
    userType,
    pstTaxPkr,
    whtPct,
    whtTaxPkr,
    netInvoicePkr,
    netPayablePkr,
    fbrSection: 'Section 153 Withholding Tax (Services)',
  });
});

export default tax;
