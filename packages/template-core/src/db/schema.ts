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
  plan: text('plan').notNull().default('free'), // free, pro, enterprise
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// Organization Memberships Table
export const memberships = sqliteTable('membership', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // owner, admin, member
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// Stripe Subscriptions Table
export const subscriptions = sqliteTable('subscription', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').notNull().unique().references(() => organizations.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripeCustomerId').notNull().unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').notNull().unique(),
  stripePriceId: text('stripePriceId').notNull(),
  status: text('status').notNull(), // active, past_due, canceled, trialing
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
  category: text('category').notNull(), // 'OOH' | 'DOOH' | 'RETAIL_SHELF' | 'CIVIC_KIOSK' | 'CAMPUS' | 'TRANSIT' | 'HORECA' | 'CREATOR' | 'TV'
  locationCity: text('locationCity').notNull(),
  locationArea: text('locationArea').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  dailyRatePkr: integer('dailyRatePkr').notNull(),
  monthlyRatePkr: integer('monthlyRatePkr').notNull(),
  dimensions: text('dimensions'), // e.g., '60x20 ft' or 'Shelf 3x1 ft'
  estimatedDailyImpressions: integer('estimatedDailyImpressions').default(0),
  softExpiryDate: text('softExpiryDate'), // e.g. 'Late August 2026'
  imageUrl: text('imageUrl'),
  status: text('status').notNull().default('AVAILABLE'), // 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// 2. Creator Profiles Table (Organic Social Influencer Rates & Metrics)
export const creatorProfiles = sqliteTable('creator_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE'
  handle: text('handle').notNull(),
  followerCount: integer('followerCount').notNull(),
  avgViews: integer('avgViews').notNull(),
  engagementRatePct: real('engagementRatePct').notNull(),
  calculatedRatePerPostPkr: integer('calculatedRatePerPostPkr').notNull(),
  niche: text('niche').notNull(), // 'FOOD' | 'FASHION' | 'TECH' | 'LIFESTYLE'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 3. Campaigns Table (Advertiser Omnichannel Campaigns)
export const campaigns = sqliteTable('campaign', {
  id: text('id').primaryKey(),
  advertiserId: text('advertiserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  totalBudgetPkr: integer('totalBudgetPkr').notNull(),
  startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp' }).notNull(),
  targetCity: text('targetCity').notNull(),
  status: text('status').notNull().default('DRAFT'), // 'DRAFT' | 'ACTIVE' | 'COMPLETED'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

// 4. Campaign Allocations Table (AI Budget Packaging Split)
export const campaignAllocations = sqliteTable('campaign_allocation', {
  id: text('id').primaryKey(),
  campaignId: text('campaignId').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  assetId: text('assetId').notNull().references(() => adAssets.id, { onDelete: 'cascade' }),
  allocatedBudgetPkr: integer('allocatedBudgetPkr').notNull(),
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'CONFIRMED' | 'LIVE' | 'VERIFIED'
  notes: text('notes'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 5. Proof of Performance & Verification Table
export const proofOfPerformance = sqliteTable('proof_of_performance', {
  id: text('id').primaryKey(),
  allocationId: text('allocationId').notNull().references(() => campaignAllocations.id, { onDelete: 'cascade' }),
  submittedByUserId: text('submittedByUserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  photoUrl: text('photoUrl').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  verifiedStatus: text('verifiedStatus').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
  payoutStatus: text('payoutStatus').notNull().default('HELD_IN_ESCROW'), // 'HELD_IN_ESCROW' | 'RELEASED'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

// 6. Escrow Transactions Table (Mobile Wallet & Bank Payout Tracker)
export const escrowTransactions = sqliteTable('escrow_transaction', {
  id: text('id').primaryKey(),
  campaignId: text('campaignId').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  payeeUserId: text('payeeUserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amountPkr: integer('amountPkr').notNull(),
  easypaisaNumber: text('easypaisaNumber'),
  jazzcashNumber: text('jazzcashNumber'),
  bankDetails: text('bankDetails'),
  status: text('status').notNull().default('HELD'), // 'HELD' | 'RELEASED' | 'REFUNDED'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
