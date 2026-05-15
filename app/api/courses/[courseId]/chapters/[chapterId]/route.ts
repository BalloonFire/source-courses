import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const Video = mux.video.assets;

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

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            });

            if (existingMuxData) {
                await Video.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }

            // @ts-ignore
            const asset = await Video.create({
                input: values.videoUrl,
                playback_policy: ["public"],
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: chapterId,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            });
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("COURSE_CHAPTER_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}