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
    const quiz_id = parseInt(quizId);

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
        quiz_id: parseInt(quizId),
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
          },
          include: {
            answers: {
              where: {
                quiz_id: quiz_id,
              },
            },
          },
        },
        //TODO: quizAttemps + userAnswers
      },
    });

    if (!quiz || !course) {
      throw new Error("Chapter or course not found");
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
      //quizAttemps + userAnswers
    };
  } catch (error) {
    console.log("[GET_QUIZ]", error);
    return {
      quiz: null,
      course: null,
      muxData: null,
      //quizAttemps + userAnswers
    };
  }
};
