-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE', 'ORDER');

-- CreateEnum
CREATE TYPE "AnswerSelectionType" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BETREUER', 'BERATERUNDBETREUER', 'BERATER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuizCategory" AS ENUM ('EXAM');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "price" DOUBLE PRECISION,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuxData" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "playbackId" TEXT,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "MuxData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "user_role" "UserRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quiz_id" SERIAL NOT NULL,
    "quiz_name" TEXT,
    "quiz_synopsis" TEXT,
    "quit_category" "QuizCategory",
    "max_points" INTEGER,
    "passing_points" INTEGER,
    "course_id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" SERIAL NOT NULL,
    "question_title" TEXT,
    "question_text" TEXT,
    "question_type" "QuestionType",
    "question_pic" TEXT,
    "question_video" TEXT,
    "answer_selection_type" "AnswerSelectionType",
    "correct_answers" INTEGER,
    "message_for_correct_answer" TEXT,
    "message_for_incorrect_answer" TEXT,
    "explanation" TEXT,
    "is_knockout" BOOLEAN,
    "points" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "user_answers" (
    "user_answer_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_attempt_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_id" INTEGER,
    "selected_order" INTEGER,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("user_answer_id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "answer_id" SERIAL NOT NULL,
    "answer_text" TEXT,
    "answer_pic" TEXT,
    "answer_video" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "position" INTEGER,
    "question_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "quiz_attempt_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("quiz_attempt_id")
);

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Attachment_courseId_idx" ON "Attachment"("courseId");

-- CreateIndex
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "MuxData_chapterId_key" ON "MuxData"("chapterId");

-- CreateIndex
CREATE INDEX "UserProgress_chapterId_idx" ON "UserProgress"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_chapterId_key" ON "UserProgress"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "Purchase_courseId_idx" ON "Purchase"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_userId_courseId_key" ON "Purchase"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_stripeCustomerId_key" ON "StripeCustomer"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Question_quiz_id_idx" ON "Question"("quiz_id");

-- CreateIndex
CREATE INDEX "user_answers_quiz_attempt_id_idx" ON "user_answers"("quiz_attempt_id");

-- CreateIndex
CREATE INDEX "Answer_question_id_idx" ON "Answer"("question_id");
