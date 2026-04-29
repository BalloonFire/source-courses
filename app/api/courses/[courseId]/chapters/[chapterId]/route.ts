import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();

        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = await params;

        const courseOwner = await db.course.findUnique({
            where: { 
                id: courseId,
                userId: userId 
            }
        });
        
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                ...values,
            }
        });

        // TODO: Add video uploading url and processing status updates here as well

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("COURSE_CHAPTER_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}