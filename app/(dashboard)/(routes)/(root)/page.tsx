import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";
import { getCourses } from "@/actions/get-courses";
import { db } from "@/lib/db";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const user = await db.user.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (!user || !user.user_id) {
    try {
      const newUser = await db.user.create({
        data: {
          user_id: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: clerkUser.firstName + " " + clerkUser.lastName,
          createdAt: new Date(clerkUser.createdAt),
          updatedAt: new Date(clerkUser.updatedAt),
          last_signed_in: new Date(clerkUser.lastSignInAt ?? new Date()),
        },
      });
    } catch (error) {
      console.log("ERROR", error);
    }
  } else {
    try {
      const updateUser = await db.user.update({
        where: {
          user_id: userId,
        },
        data: {
          name: clerkUser.firstName + " " + clerkUser.lastName,
          updatedAt: new Date(clerkUser.updatedAt),
          last_signed_in: new Date(clerkUser.lastSignInAt ?? new Date()),
        },
      });
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  const courses = await getCourses({
    userId,
  });

  const completedCourses = courses.filter((course) => course.progress === 100);

  const coursesInProgress = courses.filter(
    (course) => (course.progress ?? 0) < 100
  );

  console.log(courses, "courses");

  const isTutorialCompleted = courses.find(
    (item) =>
      item.courseCategory?.category === "Tutorial" && item.progress === 100
  );
  const tutorialCourse = courses.find(
    (item) => item.courseCategory?.category === "Tutorial"
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Unvollständig"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Abgeschlossen"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      {isTutorialCompleted ? (
        <CoursesList items={[...completedCourses, ...coursesInProgress]} />
      ) : (
        tutorialCourse && <CoursesList items={[tutorialCourse]} />
      )}
    </div>
  );
}
