import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  if ((session.user as any).role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Accès non autorisé - Admin requis' },
      { status: 403 }
    );
  }

  return null; // Success
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  return {
    id: (session.user as any).id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user as any).role,
  };
}
