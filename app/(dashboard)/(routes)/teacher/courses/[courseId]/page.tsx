import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

// Helper function to check if chapter positions are valid (0, 1, 2, ..., n-1 with no gaps)
const arePositionsValid = (chapters: Array<{ position: number }>) => {
    if (chapters.length === 0) return true;
    
    const positions = chapters.map(c => c.position).sort((a, b) => a - b);
    
    // Check if positions are exactly [0, 1, 2, ..., n-1]
    for (let i = 0; i < positions.length; i++) {
        if (positions[i] !== i) {
            return false;
        }
    }
    return true;
};

// Helper function to recalculate positions based on createdAt order
const ensureValidChapterPositions = async (courseId: string) => {
    const chapters = await db.chapter.findMany({
        where: { courseId },
        orderBy: { createdAt: "asc" },
    });

    if (chapters.length === 0) return;

    const isValid = arePositionsValid(chapters);
    
    if (!isValid) {
        // Recalculate positions based on createdAt order
        for (let i = 0; i < chapters.length; i++) {
            await db.chapter.update({
                where: { id: chapters[i].id },
                data: { position: i },
            });
        }
    }
};

const CourseIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string }>
}) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const courseId = (await params).courseId;

    // Ensure chapter positions are valid before fetching
    await ensureValidChapterPositions(courseId);

    // Fetch the course with chapters
    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            }
        },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!course) {
        return redirect("/");
    }

    // Check if positions are now valid, if so we'll use position ordering
    const positionsValid = arePositionsValid(course.chapters);
    
    // Sort chapters based on whether positions are valid
    const sortedChapters = positionsValid 
        ? [...course.chapters].sort((a, b) => a.position - b.position)
        : course.chapters;

    const requiredFields = [
        course.title,
        course.description,
        course.categoryId,
        sortedChapters.some(chapter => chapter.isPublished),
        course.price !== null && course.price !== undefined,
        course.imageUrl,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `${completedFields} of ${totalFields} fields completed`;

    const isCompleted = requiredFields.every(Boolean);

    // Pass sorted chapters to the form
    const courseWithSortedChapters = {
        ...course,
        chapters: sortedChapters,
    };

    return ( 
        <>
            {!course.isPublished && (
                <Banner
                    variant="warning"
                    label="This course is not published. Students will not be able to access it until you publish it."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course Setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields: ({completionText})
                        </span>
                    </div>
                    <Actions
                        disabled={!isCompleted}
                        courseId={course.id}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your course
                            </h2>
                        </div>
                        <TitleForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <DescriptionForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map(category => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Course Chapters
                                </h2>
                            </div>
                            <ChaptersForm
                                initialData={courseWithSortedChapters}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className="text-xl">
                                    Set Course Pricing
                                </h2>
                            </div>
                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Course Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default CourseIdPage;