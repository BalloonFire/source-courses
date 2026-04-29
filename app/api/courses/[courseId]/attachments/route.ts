import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { url, filename: providedFilename } = await req.json();
        const filename = providedFilename || url.split("/").pop() || "unknown";

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        const courseOwner = await db.course.findUnique({
            where: { 
                id: courseId,
                userId: userId 
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                filename,
                courseId: courseId,
            }
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}