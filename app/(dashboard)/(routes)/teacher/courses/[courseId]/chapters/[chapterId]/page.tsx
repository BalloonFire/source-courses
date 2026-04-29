import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Link from "next/link";

import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chaptertitle-form";

const ChapterIdPage = async ({
    params
}: {
    params: Promise<{
        courseId: string;
        chapterId: string;
    }>
}) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const { chapterId, courseId } = await params;

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId,
        },        
        include: {
            muxData: true,
        },
    });     

    if (!chapter) {
        redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const filledFields = requiredFields.filter(Boolean).length;
    
    const completedText = `Completed ${filledFields} out of ${totalFields} fields.`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link href={`/teacher/courses/${courseId}`} className="flex items-center text-sm hover:opactity-80 transition mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to course
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                {completedText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your chapter
                        </h2>
                    </div>
                    <ChapterTitleForm 
                        initialData={chapter}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChapterIdPage;