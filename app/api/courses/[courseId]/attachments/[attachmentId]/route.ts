import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, attachmentId } = await params;

        const courseOwner = await db.course.findUnique({
            where: { 
                id: courseId,
                userId: userId 
            }
        });
        
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.findUnique({
            where: {
                id: attachmentId,
                courseId: courseId,
            }
        });

        if (!attachment) {
            return new NextResponse("Attachment not found", { status: 404 });
        }

        await db.attachment.delete({
            where: {
                id: attachmentId,
                courseId: courseId,
            }
        });

        return new NextResponse("Attachment deleted", { status: 200 });

    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}