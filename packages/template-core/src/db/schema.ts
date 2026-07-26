import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users Table (Better-Auth + OMNI-GRID Multi-Role Attributes)
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').notNull().default('advertiser'), // 'advertiser' | 'vendor' | 'shopkeeper' | 'creator' | 'rider' | 'admin'
  city: text('city'),
  easypaisaNumber: text('easypaisaNumber'),
  jazzcashNumber: text('jazzcashNumber'),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// Sessions Table
export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

// Accounts Table (OAuth Providers)
export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// Verifications Table (Magic links, Password resets)
export const verifications = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
});

// Multi-Tenant Organizations Table
export const organizations = sqliteTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logoUrl'),
  plan: text('plan').notNull().default('free'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// Organization Memberships Table
export const memberships = sqliteTable('membership', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// Stripe Subscriptions Table
export const subscriptions = sqliteTable('subscription', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').notNull().unique().references(() => organizations.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripeCustomerId').notNull().unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').notNull().unique(),
  stripePriceId: text('stripePriceId').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: integer('currentPeriodStart', { mode: 'timestamp' }).notNull(),
  currentPeriodEnd: integer('currentPeriodEnd', { mode: 'timestamp' }).notNull(),
  cancelAtPeriodEnd: integer('cancelAtPeriodEnd', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// File Upload Metadata Table (R2 Tracking)
export const fileUploads = sqliteTable('file_uploads', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organizationId').references(() => organizations.id, { onDelete: 'cascade' }),
  fileName: text('fileName').notNull(),
  fileSize: integer('fileSize').notNull(),
  mimeType: text('mimeType').notNull(),
  r2Key: text('r2Key').notNull().unique(),
  publicUrl: text('publicUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// Production Audit Logs Table
export const auditLogs = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').references(() => organizations.id, { onDelete: 'set null' }),
  userId: text('userId').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  ipAddress: text('ipAddress'),
  details: text('details'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// ============================================================================
// OMNI-GRID PAKISTAN DOMAIN TABLES
// ============================================================================

// 1. Omnichannel Ad Assets Table (Billboards, Shelves, Kiosks, Transit, TV)
export const adAssets = sqliteTable('ad_asset', {
  id: text('id').primaryKey(),
  ownerId: text('ownerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  category: text('category').notNull(),
  locationCity: text('locationCity').notNull(),
  locationArea: text('locationArea').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  dailyRatePkr: integer('dailyRatePkr').notNull(),
  monthlyRatePkr: integer('monthlyRatePkr').notNull(),
  dimensions: text('dimensions'),
  estimatedDailyImpressions: integer('estimatedDailyImpressions').default(0),
  softExpiryDate: text('softExpiryDate'),
  imageUrl: text('imageUrl'),
  status: text('status').notNull().default('AVAILABLE'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// 2. Creator Profiles Table
export const creatorProfiles = sqliteTable('creator_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  handle: text('handle').notNull(),
  followerCount: integer('followerCount').notNull(),
  avgViews: integer('avgViews').notNull(),
  engagementRatePct: real('engagementRatePct').notNull(),
  calculatedRatePerPostPkr: integer('calculatedRatePerPostPkr').notNull(),
  niche: text('niche').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 3. Campaigns Table
export const campaigns = sqliteTable('campaign', {
  id: text('id').primaryKey(),
  advertiserId: text('advertiserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  totalBudgetPkr: integer('totalBudgetPkr').notNull(),
  startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp' }).notNull(),
  targetCity: text('targetCity').notNull(),
  status: text('status').notNull().default('DRAFT'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// 4. Campaign Allocations Table
export const campaignAllocations = sqliteTable('campaign_allocation', {
  id: text('id').primaryKey(),
  campaignId: text('campaignId').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  assetId: text('assetId').notNull().references(() => adAssets.id, { onDelete: 'cascade' }),
  allocatedBudgetPkr: integer('allocatedBudgetPkr').notNull(),
  status: text('status').notNull().default('PENDING'),
  notes: text('notes'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 5. Proof of Performance Table
export const proofOfPerformance = sqliteTable('proof_of_performance', {
  id: text('id').primaryKey(),
  allocationId: text('allocationId').notNull().references(() => campaignAllocations.id, { onDelete: 'cascade' }),
  submittedByUserId: text('submittedByUserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  photoUrl: text('photoUrl').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  verifiedStatus: text('verifiedStatus').notNull().default('PENDING'),
  payoutStatus: text('payoutStatus').notNull().default('HELD_IN_ESCROW'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 6. Escrow Transactions Table
export const escrowTransactions = sqliteTable('escrow_transaction', {
  id: text('id').primaryKey(),
  campaignId: text('campaignId').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  payeeUserId: text('payeeUserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amountPkr: integer('amountPkr').notNull(),
  easypaisaNumber: text('easypaisaNumber'),
  jazzcashNumber: text('jazzcashNumber'),
  bankDetails: text('bankDetails'),
  status: text('status').notNull().default('HELD'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// 7. Creatives Table (Module 6: Uploaded Media Library)
export const creatives = sqliteTable('creative', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  fileName: text('fileName').notNull(),
  fileUrl: text('fileUrl').notNull(),
  mimeType: text('mimeType').notNull(),
  format: text('format').notNull(), // 'JPEG' | 'PNG' | 'MP4' | 'PDF'
  dimensions: text('dimensions'), // e.g. '1920x1080'
  fileSizeMb: real('fileSizeMb').notNull(),
  status: text('status').notNull().default('APPROVED'), // 'DRAFT' | 'APPROVED' | 'REJECTED'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 8. Wishlists Table (Module 27: Saved Collections & Shortlists)
export const wishlists = sqliteTable('wishlist', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  assetId: text('assetId').notNull().references(() => adAssets.id, { onDelete: 'cascade' }),
  collectionName: text('collectionName').notNull().default('Favorites'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 9. Asset Reviews Table (Module 28: Advertiser Ratings & Feedback)
export const reviews = sqliteTable('asset_review', {
  id: text('id').primaryKey(),
  assetId: text('assetId').notNull().references(() => adAssets.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ratingStars: integer('ratingStars').notNull(), // 1 to 5
  comment: text('comment').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 10. TV Broadcast Channels Table (Module 20: TV Spot Booking)
export const tvChannels = sqliteTable('tv_channel', {
  id: text('id').primaryKey(),
  channelName: text('channelName').notNull(), // 'Geo News' | 'ARY Digital' | 'Hum TV' | 'PTV Sports'
  spotType: text('spotType').notNull(), // 'NEWS_TICKER' | 'TALKSHOW_LBAR' | 'BULLETIN_SPOT'
  ratePerSpotPkr: integer('ratePerSpotPkr').notNull(),
  estViewers: integer('estViewers').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});
