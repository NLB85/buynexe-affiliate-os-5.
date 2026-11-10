
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  network TEXT,
  "productName" TEXT,
  "affiliateUrl" TEXT,
  status TEXT DEFAULT 'draft',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  "campaignId" TEXT,
  "campaignName" TEXT,
  name TEXT,
  email TEXT,
  source TEXT,
  stage TEXT DEFAULT 'New Lead',
  consented BOOLEAN DEFAULT FALSE,
  "affiliateUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id TEXT PRIMARY KEY,
  "campaignId" TEXT,
  "campaignName" TEXT,
  "leadId" TEXT,
  "offerName" TEXT,
  "affiliateUrl" TEXT,
  "clickedAt" TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  revenue NUMERIC DEFAULT 0
);
