import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/admin/settings/reset - Reset admin settings to defaults
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Return default settings
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

    return NextResponse.json({ 
      message: 'Paramètres réinitialisés avec succès',
      settings: defaultSettings 
    });
  } catch (error) {
    console.error('Error resetting admin settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation des paramètres' },
      { status: 500 }
    );
  }
}
