import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';
import { authOptions } from '@/lib/auth';

// GET /api/users/[id] - Détails utilisateur (Admin only)
export async function GET(req: Request, ctx: any) {
  const { params } = ctx;
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          include: {
            items: true,
          },
        },
        addresses: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Ne pas retourner le password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Modifier utilisateur (Admin only)
export async function PATCH(req: Request, ctx: any) {
  const { params } = ctx;
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Prevent admin from demoting themselves
    if (
      params.id === (session.user as any).id &&
      data.role &&
      data.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas changer votre propre rôle' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        role: data.role,
        name: data.name,
        phone: data.phone,
        emailVerified: data.emailVerified,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Supprimer utilisateur (Admin only)
export async function DELETE(req: Request, ctx: any) {
  const { params } = ctx;
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Prevent admin from deleting themselves
    if (params.id === (session.user as any).id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      message: 'Utilisateur supprimé avec succès' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
