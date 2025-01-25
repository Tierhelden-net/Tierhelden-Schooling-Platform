/*
  Warnings:

  - You are about to drop the column `course_id` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "course_id";

-- CreateTable
CREATE TABLE "CourseQuiz" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "course_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseQuiz_quiz_id_course_id_key" ON "CourseQuiz"("quiz_id", "course_id");
