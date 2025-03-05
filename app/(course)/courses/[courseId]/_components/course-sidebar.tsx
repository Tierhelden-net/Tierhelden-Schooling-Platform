import { auth } from "@clerk/nextjs";
import {
  Chapter,
  Course,
  CourseQuiz,
  Quiz,
  UserProgress,
} from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseSidebarQuizItem } from "./course-sidebar-quiz-item";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
    quizzes: (CourseQuiz & {
      quiz: Quiz;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  const quiz = course.quizzes?.[0]?.quiz ?? null;

  const quizLocked = !course.chapters.every(
    (chapter) => chapter.userProgress?.[0]?.isCompleted
  );

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  const quizPassed = await db.quizAttempt.findFirst({
    where: {
      user_id: userId,
      quiz_id: quiz.quiz_id,
      passed: true,
    },
    select: {
      passed: true,
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
        {course.quizzes.length > 0 && (
          <CourseSidebarQuizItem
            key={quiz.quiz_id}
            id={quiz.quiz_id.toString()}
            label={quiz.quiz_name ?? ""}
            isCompleted={quizPassed?.passed ?? false}
            courseId={course.id}
            isLocked={quizLocked}
          />
        )}
      </div>
    </div>
  );
};
