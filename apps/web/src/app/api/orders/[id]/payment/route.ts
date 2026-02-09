import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { paymentCode, otpCode, paymentMethod } = await request.json();

    if (!paymentCode || !paymentMethod) {
      return NextResponse.json({ error: 'Code de paiement requis' }, { status: 400 });
    }

    // Récupérer la commande
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Vérifier si le paiement n'est pas déjà validé
    if (order.paymentStatus === 'COMPLETED') {
      return NextResponse.json({ error: 'Paiement déjà validé' }, { status: 400 });
    }

    // Pour la démo, nous acceptons tous les codes qui commencent par "OM"
    // En réalité, vous intégreriez l'API Orange Money ici pour vérifier le code
    const isValidPayment = paymentCode.toUpperCase().startsWith('OM');
    
    if (!isValidPayment) {
      return NextResponse.json({ error: 'Code de paiement invalide' }, { status: 400 });
    }

    // Générer et envoyer le code OTP automatiquement
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // En réalité, vous enverriez le SMS ici
    // await sendOTPSMS(order.shippingAddress.phone, generatedOTP);
    
    console.log(`📱 OTP généré pour ${order.shippingAddress.phone}: ${generatedOTP}`);
    
    // Stocker l'OTP temporairement (en production, utilisez Redis ou base de données)
    await prisma.order.update({
      where: { id: params.id },
      data: {
        adminNote: `OTP_TEMP:${generatedOTP}:${Date.now()}`, // Stockage temporaire
      },
    });
    
    // Si OTP est fourni dans la même requête, vérifier
    if (otpCode) {
      if (otpCode !== generatedOTP) {
        return NextResponse.json({ error: 'Code OTP incorrect' }, { status: 400 });
      }
      
      // OTP correct, procéder à la validation du paiement
      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PROCESSING',
          updatedAt: new Date(),
        },
      });

      // Mettre à jour l'enregistrement de paiement
      await prisma.payment.updateMany({
        where: { orderId: params.id },
        data: {
          status: 'COMPLETED',
          transactionId: paymentCode,
          updatedAt: new Date(),
          paidAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: 'Paiement validé avec succès',
      });
    }
    
    // Retourner l'OTP généré pour la démo
    return NextResponse.json({
      success: true,
      otp: generatedOTP,
      message: 'OTP généré avec succès',
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}
