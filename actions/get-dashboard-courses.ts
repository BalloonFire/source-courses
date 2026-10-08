import { Category, Course, Chapter } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    progress: number | null;
    chapters: Chapter[];
    category: Category;
};

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    inProgressCourses: CourseWithProgressWithCategory[];
    notStartedCourses: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        },
                    },
                },
            },
        });

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course.progress = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const inProgressCourses = courses.filter((course) => course.progress !== null && course.progress > 0 && course.progress < 100);
        const notStartedCourses = courses.filter((course) => course.progress === null || course.progress === 0);

        return {
            completedCourses,
            inProgressCourses,
            notStartedCourses,
        };
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            inProgressCourses: [],
            notStartedCourses: []
        }
    }
}