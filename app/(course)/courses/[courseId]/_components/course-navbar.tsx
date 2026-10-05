import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobilesidebar";
import { Chapter, Course, UserProgress } from "@prisma/client";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = async ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <CourseMobileSidebar
            course={course}
            progressCount={progressCount}
        />
        <NavbarRoutes />
    </div>
  )
}
