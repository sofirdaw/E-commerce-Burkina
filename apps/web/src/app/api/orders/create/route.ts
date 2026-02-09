import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    const {
      items,
      shippingAddress,
      paymentMethod,
      orangeMoneyPhone,
      subtotal,
      shippingCost,
      totalAmount,
    } = await req.json();

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Informations manquantes' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `EB${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        userId: session?.user ? (session.user as any).id : 'guest',
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        city: shippingAddress.city,
        region: shippingAddress.region,
        country: 'Burkina Faso',
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user ? (session.user as any).id : 'guest',
        shippingAddressId: address.id,
        subtotal,
        shippingCost,
        totalAmount,
        paymentMethod,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.name || 'Product',
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        currency: 'XOF',
        method: paymentMethod,
        status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING',
        orangeMoneyPhone: paymentMethod === 'ORANGE_MONEY' ? orangeMoneyPhone : null,
      },
    });

    // TODO: If Orange Money, initiate payment request
    if (paymentMethod === 'ORANGE_MONEY') {
      // Call Orange Money API here
      console.log('Orange Money payment for order:', order.orderNumber);
    }

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la commande' },
      { status: 500 }
    );
  }
}
