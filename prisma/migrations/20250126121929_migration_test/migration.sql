/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `quiz_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_answers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "createdBy";

-- DropTable
DROP TABLE "quiz_attempts";

-- DropTable
DROP TABLE "user_answers";

-- CreateTable
CREATE TABLE "UserAnswer" (
    "user_answer_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_attempt_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_id" INTEGER,
    "selected_order" INTEGER,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("user_answer_id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "quiz_attempt_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("quiz_attempt_id")
);

-- CreateIndex
CREATE INDEX "UserAnswer_quiz_attempt_id_idx" ON "UserAnswer"("quiz_attempt_id");
