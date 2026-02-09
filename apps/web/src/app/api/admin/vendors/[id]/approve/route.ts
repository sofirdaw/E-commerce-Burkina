import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ecomm-burkina/database';
import { sendVendorApprovalEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await prisma.vendorApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette demande a déjà été traitée' },
        { status: 400 }
      );
    }

    // Générer un mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Créer le compte revendeur
    const vendor = await prisma.user.create({
      data: {
        email: application.email,
        name: `${application.firstName} ${application.lastName}`,
        phone: application.phone,
        password: hashedPassword,
        role: 'VENDOR',
        emailVerified: new Date(),
      },
    });

    // Créer le profil revendeur
    await prisma.vendor.create({
      data: {
        userId: vendor.id,
        businessName: application.businessName,
        businessPhone: application.phone,
        businessEmail: application.email,
        description: application.description,
        address: application.address,
        city: application.city,
        region: application.region,
        commissionRate: 0.10, // 10% de commission
        status: 'APPROVED',
        verifiedAt: new Date(),
      },
    });

    // Mettre à jour le statut de la demande
    await prisma.vendorApplication.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        userId: vendor.id,
      },
    });

    // Envoyer l'email d'approbation avec les accès
    await sendVendorApprovalEmail(application, tempPassword);

    return NextResponse.json({
      success: true,
      message: 'Revendeur approuvé avec succès',
      vendor: {
        id: vendor.id,
        email: vendor.email,
        name: vendor.name,
        businessName: application.businessName,
      },
    });

  } catch (error) {
    console.error('Vendor approval error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation du revendeur' },
      { status: 500 }
    );
  }
}
