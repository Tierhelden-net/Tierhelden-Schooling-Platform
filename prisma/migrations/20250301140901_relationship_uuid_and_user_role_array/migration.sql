/*
  Warnings:

  - The values [BERATERUNDBETREUER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Course` table. All the data in the column will be lost.
  - The primary key for the `CourseQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LiveTraining` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LiveTrainingSignUp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `quit_category` on the `Quiz` table. All the data in the column will be lost.
  - The primary key for the `QuizAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserAnswer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `quiz_id` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Changed the column `user_role` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('BETREUER', 'BERATER', 'ADMIN', 'EVENTLEITER', 'AFFILIATE', 'SUBADMIN');
ALTER TABLE "User" ALTER COLUMN "user_role" TYPE "UserRole_new"[] USING ("user_role"::text::"UserRole_new"[]);
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropIndex
DROP INDEX "Course_categoryId_idx";

-- AlterTable
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_pkey",
ALTER COLUMN "answer_id" DROP DEFAULT,
ALTER COLUMN "answer_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ALTER COLUMN "quiz_id" SET NOT NULL,
ALTER COLUMN "quiz_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_id");
DROP SEQUENCE "Answer_answer_id_seq";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "categoryId",
ADD COLUMN     "courseCategoryId" TEXT;

-- AlterTable
ALTER TABLE "CourseQuiz" DROP CONSTRAINT "CourseQuiz_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "quiz_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CourseQuiz_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CourseQuiz_id_seq";

-- AlterTable
ALTER TABLE "LiveTraining" DROP CONSTRAINT "LiveTraining_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LiveTraining_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LiveTraining_id_seq";

-- AlterTable
ALTER TABLE "LiveTrainingSignUp" DROP CONSTRAINT "LiveTrainingSignUp_pkey",
ALTER COLUMN "liveTraining_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LiveTrainingSignUp_pkey" PRIMARY KEY ("liveTraining_id", "user_id");

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "question_id" DROP DEFAULT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ALTER COLUMN "quiz_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id");
DROP SEQUENCE "Question_question_id_seq";

-- AlterTable
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_pkey",
DROP COLUMN "quit_category",
ADD COLUMN     "quizCategoryId" TEXT,
ALTER COLUMN "quiz_id" DROP DEFAULT,
ALTER COLUMN "quiz_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quiz_id");
DROP SEQUENCE "Quiz_quiz_id_seq";

-- AlterTable
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_pkey",
ALTER COLUMN "quiz_attempt_id" DROP DEFAULT,
ALTER COLUMN "quiz_attempt_id" SET DATA TYPE TEXT,
ALTER COLUMN "quiz_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("quiz_attempt_id");
DROP SEQUENCE "QuizAttempt_quiz_attempt_id_seq";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user_role" SET DATA TYPE "UserRole"[];

-- AlterTable
ALTER TABLE "UserAnswer" DROP CONSTRAINT "UserAnswer_pkey",
ALTER COLUMN "user_answer_id" DROP DEFAULT,
ALTER COLUMN "user_answer_id" SET DATA TYPE TEXT,
ALTER COLUMN "quiz_attempt_id" SET DATA TYPE TEXT,
ALTER COLUMN "quiz_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ALTER COLUMN "answer_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("user_answer_id");
DROP SEQUENCE "UserAnswer_user_answer_id_seq";

-- DropTable
DROP TABLE "Category";

-- DropEnum
DROP TYPE "QuizCategory";

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterCategory" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "ChapterCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterChapterCategory" (
    "chapterId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ChapterChapterCategory_pkey" PRIMARY KEY ("chapterId","categoryId")
);

-- CreateTable
CREATE TABLE "QuizCategory" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "QuizCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_category_key" ON "CourseCategory"("category");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterCategory_category_key" ON "ChapterCategory"("category");

-- CreateIndex
CREATE INDEX "ChapterChapterCategory_categoryId_idx" ON "ChapterChapterCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizCategory_category_key" ON "QuizCategory"("category");

-- CreateIndex
CREATE INDEX "Answer_quiz_id_idx" ON "Answer"("quiz_id");

-- CreateIndex
CREATE INDEX "Course_courseCategoryId_idx" ON "Course"("courseCategoryId");

-- CreateIndex
CREATE INDEX "CourseQuiz_quiz_id_idx" ON "CourseQuiz"("quiz_id");

-- CreateIndex
CREATE INDEX "CourseQuiz_course_id_idx" ON "CourseQuiz"("course_id");

-- CreateIndex
CREATE INDEX "LiveTraining_teacher_id_idx" ON "LiveTraining"("teacher_id");

-- CreateIndex
CREATE INDEX "LiveTraining_coteacher_id_idx" ON "LiveTraining"("coteacher_id");

-- CreateIndex
CREATE INDEX "LiveTrainingSignUp_user_id_idx" ON "LiveTrainingSignUp"("user_id");

-- CreateIndex
CREATE INDEX "Quiz_quizCategoryId_idx" ON "Quiz"("quizCategoryId");

-- CreateIndex
CREATE INDEX "QuizAttempt_user_id_idx" ON "QuizAttempt"("user_id");

-- CreateIndex
CREATE INDEX "QuizAttempt_quiz_id_idx" ON "QuizAttempt"("quiz_id");

-- CreateIndex
CREATE INDEX "UserAnswer_user_id_idx" ON "UserAnswer"("user_id");

-- CreateIndex
CREATE INDEX "UserAnswer_quiz_id_idx" ON "UserAnswer"("quiz_id");

-- CreateIndex
CREATE INDEX "UserAnswer_question_id_idx" ON "UserAnswer"("question_id");

-- CreateIndex
CREATE INDEX "UserAnswer_answer_id_idx" ON "UserAnswer"("answer_id");
