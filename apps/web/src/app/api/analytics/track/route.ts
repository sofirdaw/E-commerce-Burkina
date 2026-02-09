import { NextResponse } from 'next/server';

interface AnalyticsData {
  date: string;
  pageViews: Record<string, number>;
  visitors: Set<string>;
  trafficSources: {
    direct: number;
    search: number;
    social: number;
    referral: number;
  };
}

// Simple analytics tracking API
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, path, referrer, userAgent } = data;

    // Store in file system for now (in production, use database)
    const fs = require('fs').promises;
    const pathModule = require('path');
    
    await ensureDataDirectory();
    
    const today = new Date().toISOString().split('T')[0];
    const analyticsFile = pathModule.join(process.cwd(), 'data', `analytics-${today}.json`);
    
    let analytics: AnalyticsData = {
      date: today,
      pageViews: {},
      visitors: new Set(),
      trafficSources: {
        direct: 0,
        search: 0,
        social: 0,
        referral: 0
      }
    };
    
    try {
      const existingData = await fs.readFile(analyticsFile, 'utf8');
      const parsed = JSON.parse(existingData);
      analytics = {
        ...parsed,
        visitors: new Set(parsed.visitors || [])
      };
    } catch {
      // File doesn't exist, start fresh
    }

    // Track page view
    if (type === 'pageView' && path) {
      analytics.pageViews[path] = (analytics.pageViews[path] || 0) + 1;
    }

    // Track traffic source
    if (referrer) {
      if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
        analytics.trafficSources.search++;
      } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram')) {
        analytics.trafficSources.social++;
      } else if (referrer !== 'direct') {
        analytics.trafficSources.referral++;
      } else {
        analytics.trafficSources.direct++;
      }
    } else {
      analytics.trafficSources.direct++;
    }

    // Save analytics (convert Set to Array for JSON serialization)
    const analyticsToSave = {
      ...analytics,
      visitors: Array.from(analytics.visitors)
    };
    
    await fs.writeFile(analyticsFile, JSON.stringify(analyticsToSave, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}

// Helper function to ensure data directory exists
async function ensureDataDirectory() {
  const fs = require('fs').promises;
  const pathModule = require('path');
  
  try {
    await fs.access(pathModule.join(process.cwd(), 'data'));
  } catch {
    await fs.mkdir(pathModule.join(process.cwd(), 'data'), { recursive: true });
  }
}
