import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const assosiatedQuiz = await db.courseQuiz.findMany({
      where: {
        course_id: courseId,
      },
      include: {
        quiz: {
          select: {
            quiz_id: true,
          },
        },
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);
    const assosiatedQuizIds = assosiatedQuiz.map((quiz) => quiz.quiz.quiz_id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const completedQuiz = await db.quizAttempt.findMany({
      where: {
        user_id: userId,
        quiz_id: {
          in: assosiatedQuizIds,
        },
        passed: true,
      },
      select: {
        quiz_id: true,
      },
    });

    //remove similiar entries if quiz was passed multiple times
    const completedQuizIds = completedQuiz.map((quiz) => quiz.quiz_id);
    const passedQuizzes = completedQuizIds.filter(
      (item, index) => completedQuizIds.indexOf(item) === index
    );

    const progressPercentage =
      ((validCompletedChapters + passedQuizzes.length) /
        (publishedChapterIds.length + assosiatedQuizIds.length)) *
      100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
