import { quiz } from "@/components/quiz";
import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetQuizProps {
  userId: string;
  courseId: string;
  quizId: string;
}

export const getQuiz = async ({ userId, courseId, quizId }: GetQuizProps) => {
  try {
    const quiz_id = quizId;

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      include: {
        quizzes: {
          where: {
            quiz_id: quiz_id,
          },
        },
      },
    });

    const quiz = await db.quiz.findUnique({
      where: {
        quiz_id: quizId,
      },
      include: {
        courses: {
          where: {
            course_id: courseId,
          },
        },
        questions: {
          where: {
            quiz_id: quiz_id,
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
          include: {
            answers: {
              where: {
                quiz_id: quiz_id,
              },
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    if (!quiz || !course) {
      throw new Error("Chapter or course not found");
    }

    const quizAttempts = await db.quizAttempt.findMany({
      where: {
        quiz_id: quiz_id,
        user_id: userId,
      },
      orderBy: {
        attempt_at: "desc",
      },
      include: {
        userAnswers: true,
      },
    });

    //find completed quiz attempts
    let completedQuizAttempts = [];
    let notCompletedQuizAttempts = [];
    for (let quizAttempt of quizAttempts) {
      const answeredQuestions = quizAttempt.userAnswers.map(
        (userAnswer) => userAnswer.question_id
      );
      let completed = true;
      for (let question of quiz.questions) {
        if (!answeredQuestions.includes(question.question_id)) {
          notCompletedQuizAttempts.push(quizAttempt);
          completed = false;
          break;
        }
      }
      if (completed) {
        completedQuizAttempts.push(quizAttempt);
      }
    }

    let muxData = null;

    /*if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        }
      });
      

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    });
    */

    return {
      quiz,
      course,
      muxData,
      completedQuizAttempts,
      notCompletedQuizAttempts,
    };
  } catch (error) {
    console.log("[GET_QUIZ]", error);
    return {
      quiz: null,
      course: null,
      muxData: null,
      quizAttemps: null,
    };
  }
};
