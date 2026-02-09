import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session.user as any)?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Récupérer tous les revendeurs avec leurs statistiques
    const vendors = await prisma.user.findMany({
      where: {
        role: 'VENDOR',
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        vendorProfile: true,
        products: {
          include: {
            _count: {
              select: {
                orderItems: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculer les statistiques pour chaque revendeur
    const vendorsWithStats = vendors.map(vendor => {
      const totalProducts = vendor._count.products;
      const totalSales = vendor.products.reduce((sum, product) => 
        sum + product._count.orderItems, 0
      );
      const totalRevenue = vendor.products.reduce((sum, product) => 
        sum + (product.price * product._count.orderItems), 0
      );
      const commission = totalRevenue * (vendor.vendorProfile?.commissionRate || 0.10);

      return {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        businessName: vendor.vendorProfile?.businessName,
        businessType: vendor.vendorProfile?.businessType,
        commissionRate: vendor.vendorProfile?.commissionRate || 0.10,
        isActive: vendor.vendorProfile?.isActive || false,
        approvedAt: vendor.vendorProfile?.approvedAt,
        totalProducts,
        totalSales,
        totalRevenue,
        commission,
        createdAt: vendor.createdAt,
        lastLoginAt: vendor.lastLoginAt,
      };
    });

    // Filtrer par statut si spécifié
    const filteredVendors = status 
      ? vendorsWithStats.filter(vendor => 
          status === 'active' ? vendor.isActive : 
          status === 'inactive' ? !vendor.isActive : true
        )
      : vendorsWithStats;

    return NextResponse.json(filteredVendors);

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des revendeurs' },
      { status: 500 }
    );
  }
}
