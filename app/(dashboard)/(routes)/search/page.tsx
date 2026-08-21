import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

interface SearchPageProps {
  searchParams?: Promise<{
    title?: string | string[];
    categoryId?: string | string[];
  }> | {
    title?: string | string[];
    categoryId?: string | string[];
  };
}

const normalizeSearchParam = (value?: string | string[]) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const resolvedTitle = normalizeSearchParam(resolvedSearchParams.title);
  const resolvedCategoryId = normalizeSearchParam(resolvedSearchParams.categoryId);

  const courses = await getCourses({
    userId,
    title: resolvedTitle,
    categoryId: resolvedCategoryId,
  })

  return (
    <>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
