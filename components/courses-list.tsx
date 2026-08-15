import { Category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
  return (
    <div>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
              <p>Category: {item.category?.name || "No category"}</p>
              <p>Progress: {item.progress !== null ? `${item.progress.toFixed(2)}%` : "Not purchased"}</p>
          </div>
        ))}
      </div>
        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found.
          </div>
        )}
    </div>
  );
}