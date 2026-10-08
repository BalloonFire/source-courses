import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { CheckCircle, CircleDashed, Clock } from "lucide-react";
import { InfoCard } from "./_components/infocard";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, inProgressCourses, notStartedCourses } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard 
          icon={Clock}
          label="In Progress"
          numberOfItems={inProgressCourses.length}
        />
        <InfoCard 
          icon={CircleDashed}
          label="Not Started"
          numberOfItems={notStartedCourses.length}
        />
        <InfoCard 
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList
        items={[...inProgressCourses, ...notStartedCourses, ...completedCourses]}
      />
    </div>
  );
}