import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    return { userId };
}

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
    courseAttachment: f(["text", "image", "pdf", "video", "audio"])
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
