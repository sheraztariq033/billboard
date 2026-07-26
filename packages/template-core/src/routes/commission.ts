import { Hono } from 'hono';

const commission = new Hono();

// POST /api/commission/calculate - Multi-Owner Waterfall & Agent Referral Commission Split
commission.post('/calculate', async (c) => {
  const body = await c.req.json();
  const grossBookingPkr = Number(body.grossBookingPkr || 1000000);
  const agentCommissionPct = Number(body.agentCommissionPct || 2.5); // 2.5% sales agent commission

  const platformCommissionPkr = Math.round(grossBookingPkr * 0.10); // 10% OMNI-GRID platform fee
  const agentPayoutPkr = Math.round(grossBookingPkr * (agentCommissionPct / 100));
  const netOwnerPayoutPkr = grossBookingPkr - platformCommissionPkr - agentPayoutPkr;

  return c.json({
    grossBookingPkr,
    platformCommissionPkr,
    platformCommissionPct: 10,
    agentPayoutPkr,
    agentCommissionPct,
    netOwnerPayoutPkr,
    netOwnerPayoutPct: 100 - 10 - agentCommissionPct,
    waterfall: [
      { party: 'OMNI-GRID Platform Fee', pct: 10, amountPkr: platformCommissionPkr },
      { party: 'Sales Agent Referral Commission', pct: agentCommissionPct, amountPkr: agentPayoutPkr },
      { party: 'Media Asset Owner Net Escrow Release', pct: 100 - 10 - agentCommissionPct, amountPkr: netOwnerPayoutPkr },
    ],
  });
});

export default commission;
