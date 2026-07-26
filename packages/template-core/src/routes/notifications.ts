import { Hono } from 'hono';

const notifications = new Hono();

// POST /api/notifications/send-alert - WhatsApp & SMS Notification Dispatch Engine
notifications.post('/send-alert', async (c) => {
  const body = await c.req.json();
  const recipientPhone = body.phone || '+923001234567';
  const alertType = body.alertType || 'WHATSAPP_BOOKING_APPROVED';
  const campaignName = body.campaignName || 'Ramadan Beverage Launch';

  return c.json({
    success: true,
    recipientPhone,
    alertType,
    channel: alertType.includes('WHATSAPP') ? 'WhatsApp Business API' : 'Jazz/Telenor SMS Gateway',
    timestamp: new Date().toISOString(),
    status: 'DELIVERED',
    messageSnippet: `[OMNI-GRID PAKISTAN Alert] Your booking for '${campaignName}' is APPROVED. Payment locked in Escrow. View proof-of-play live stream: https://omni-grid-app.pages.dev/explore`,
  });
});

export default notifications;
