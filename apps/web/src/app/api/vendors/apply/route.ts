import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ecomm-burkina/database';
import { sendVendorApplicationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      businessName,
      businessType,
      description,
      address,
      city,
      region,
    } = await req.json();

    // Validation
    if (!firstName || !lastName || !email || !phone || !businessName) {
      return NextResponse.json(
        { error: 'Informations requises manquantes' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Vérifier si une demande existe déjà
    const existingApplication = await prisma.vendorApplication.findFirst({
      where: { email },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Une demande de revendeur est déjà en cours pour cet email' },
        { status: 400 }
      );
    }

    // Créer la demande de revendeur
    const application = await prisma.vendorApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        businessName,
        businessType,
        description,
        address,
        city,
        region,
        status: 'PENDING',
      },
    });

    // Envoyer l'email de notification à l'admin
    await sendVendorApplicationEmail(application);

    return NextResponse.json({
      success: true,
      message: 'Votre demande de revendeur a été soumise avec succès. Nous vous contacterons dans les 24h.',
      applicationId: application.id,
    });

  } catch (error) {
    console.error('Vendor application error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission de la demande' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const applications = await prisma.vendorApplication.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);

  } catch (error) {
    console.error('Error fetching vendor applications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    );
  }
}
