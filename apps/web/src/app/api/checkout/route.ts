import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const getStripe = () => {
  const secretKey = process.env.NEXT_STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('NEXT_STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey);
};

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const lineItems = items.map((item: { name: string; quantity: number; price: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout?step=confirmation&success=true`,
      cancel_url: `${request.headers.get('origin')}/checkout?step=payment&canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        items: JSON.stringify(items.map((i: { productId: string; quantity: number }) => ({
          productId: i.productId,
          quantity: i.quantity,
        }))),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}