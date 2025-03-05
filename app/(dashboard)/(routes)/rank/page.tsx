import React from "react";
import { DataCard } from "../teacher/analytics/_components/data-card";
import { RANK_CATEGORIES, getRankCourses } from "@/actions/get-rank-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { QuizCard } from "@/components/quiz-card";

async function Page() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const rankCourses = await getRankCourses({ userId });

  return (
    <div className="p-6 space-y-4">
      {RANK_CATEGORIES.map((category) => (
        <DataCard key={category} label={category}>
          <CoursesList
            items={rankCourses.filter(
              (course) => course.courseCategory?.category === category
            )}
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-8">
            <QuizCard
              id="1"
              title={`${category} - Quiz`}
              questionsCount={3}
              progress={null}
              category="Basics"
            />
          </div>
        </DataCard>
      ))}
    </div>
  );
}

export default Page;
