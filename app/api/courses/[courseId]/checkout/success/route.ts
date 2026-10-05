import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const user = await currentUser();
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!user?.id || !sessionId) {
    return NextResponse.redirect(new URL(`/courses/${courseId}`, req.url));
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const isPaid =
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required";

  if (
    session.status !== "complete" ||
    session.mode !== "payment" ||
    !isPaid ||
    session.metadata?.userId !== user.id ||
    session.metadata?.courseId !== courseId
  ) {
    return NextResponse.redirect(
      new URL(`/courses/${courseId}?checkout=unverified`, req.url)
    );
  }

  await db.purchase.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    create: {
      userId: user.id,
      courseId,
    },
    update: {},
  });

  return NextResponse.redirect(new URL(`/courses/${courseId}`, req.url));
}