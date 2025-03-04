import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";

import { getCourses } from "@/actions/get-courses";
import { db } from "@/lib/db";

export default async function BeraterPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      user_role: true,
    },
  });

  if (!user?.user_role.includes("BERATER")) {
    return redirect("/");
  }

  const courses = await getCourses({
    userId,
    categoryId: "3",
  });

  const completedCourses = courses.filter((course) => course.progress === 100);

  const coursesInProgress = courses.filter(
    (course) => (course.progress ?? 0) < 100
  );

  const tutorialCourse = await getCourses({
    userId,
    categoryId: "1",
  });

  const isTutorialCompleted = tutorialCourse.every(
    (item) => item.progress === 100
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
      {isTutorialCompleted ? (
        <CoursesList items={[...completedCourses, ...coursesInProgress]} />
      ) : (
        <p>Bitte schließe zunächst die Grundschulung ab.</p>
      )}
    </div>
  );
}
