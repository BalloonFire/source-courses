import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request,) {
    try {
        const { userId } = await auth();
        const { name } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                title: name,
                userId,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Failed to create course", { status: 500 });
    }
}