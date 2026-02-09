import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';

// Default settings
const defaultSettings = {
  storeName: 'Ecomm Burkina',
  storeEmail: 'contact@ecomm-burkina.bf',
  storePhone: '+226 00 00 00 00',
  storeAddress: 'Ouagadougou, Burkina Faso',
  storeDescription: 'Votre boutique de confiance au Burkina Faso',
  freeShippingThreshold: 50000,
  standardShippingCost: 2000,
  expressShippingAvailable: true,
  expressShippingCost: 5000,
  emailNotifications: true,
  smsNotifications: false,
  maintenanceMode: false,
};

// GET /api/admin/settings - Get admin settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Store settings in file system for persistence
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const settingsData = await fs.readFile(
        path.join(process.cwd(), 'data', 'settings.json'), 
        'utf8'
      );
      const settings = JSON.parse(settingsData);
      return NextResponse.json(settings);
    } catch (error) {
      // If file doesn't exist, create it with defaults
      await ensureDataDirectory();
      await fs.writeFile(
        path.join(process.cwd(), 'data', 'settings.json'), 
        JSON.stringify({ ...defaultSettings, id: '1', createdAt: new Date(), updatedAt: new Date() }, null, 2)
      );
      return NextResponse.json({ ...defaultSettings, id: '1', createdAt: new Date(), updatedAt: new Date() });
    }
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update admin settings
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const settings = await req.json();
    
    // Validate required fields
    const requiredFields = ['storeName', 'storeEmail', 'storePhone', 'storeAddress'];
    for (const field of requiredFields) {
      if (!settings[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Save to file system for persistence
    const fs = require('fs').promises;
    const path = require('path');
    
    await ensureDataDirectory();
    
    const updatedSettings = {
      ...settings,
      id: '1',
      updatedAt: new Date(),
    };

    await fs.writeFile(
      path.join(process.cwd(), 'data', 'settings.json'), 
      JSON.stringify(updatedSettings, null, 2)
    );

    console.log('Settings updated and saved:', updatedSettings);

    return NextResponse.json({ 
      message: 'Paramètres sauvegardés avec succès',
      settings: updatedSettings 
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des paramètres' },
      { status: 500 }
    );
  }
}

// Helper function to ensure data directory exists
async function ensureDataDirectory() {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    await fs.access(path.join(process.cwd(), 'data'));
  } catch {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
  }
}
