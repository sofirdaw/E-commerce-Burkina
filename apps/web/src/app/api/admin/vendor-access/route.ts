import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Simulation de base de données pour la démo
// Dans une vraie application, vous utiliseriez Prisma ou une autre base de données
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ecomm-burkina.bf',
    role: 'ADMIN',
    hasVendorAccess: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2', 
    name: 'Vendor User',
    email: 'vendor@ecomm-burkina.bf',
    role: 'USER',
    hasVendorAccess: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@ecomm-burkina.bf', 
    role: 'USER',
    hasVendorAccess: false,
    createdAt: new Date('2024-02-01')
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    return NextResponse.json({ users: mockUsers });
  } catch (error) {
    console.error('Erreur lors de la récupération des accès vendeur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { userId, hasVendorAccess } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Simuler la mise à jour de l'accès vendeur
    const userIndex = mockUsers.findIndex((user: any) => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'accès vendeur
    mockUsers[userIndex].hasVendorAccess = hasVendorAccess;

    return NextResponse.json({ 
      message: 'Accès vendeur mis à jour avec succès',
      user: mockUsers[userIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'accès vendeur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
