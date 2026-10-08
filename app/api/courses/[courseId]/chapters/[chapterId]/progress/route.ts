import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { chapterId } = await params;

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId: userId,
                    chapterId: chapterId,
                },
            },
            update: {
                isCompleted: isCompleted,
            },
            create: {
                userId: userId,
                chapterId: chapterId,
                isCompleted: isCompleted,
            },
        });

        return NextResponse.json(userProgress);
        
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}