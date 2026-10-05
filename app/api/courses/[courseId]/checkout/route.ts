import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { htmlToText } from "@/lib/html-to-text";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const user = await currentUser();

    if (
      !user || !user.id || !user.emailAddresses?.[0]?.emailAddress
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: htmlToText(course.description ?? ""),
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.customer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.customer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${course.id}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}