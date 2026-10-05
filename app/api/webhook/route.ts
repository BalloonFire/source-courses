import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === 'checkout.session.completed') {
        if (!userId || !courseId) {
            return new NextResponse('Missing userId or courseId in metadata', {
                status: 400,
            });
        }
        await db.purchase.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            create: {
                userId,
                courseId,
            },
            update: {},
        });
    } else {
        return new NextResponse('Event type not handled', { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}