-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "is_knockout" SET DEFAULT false,
ALTER COLUMN "points" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "max_points" SET DEFAULT 0,
ALTER COLUMN "passing_points" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "LiveTraining" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "link" TEXT,
    "picture" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "publishing_time" TIMESTAMP(3),
    "teacher_id" TEXT,
    "coteacher_id" TEXT,

    CONSTRAINT "LiveTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveTrainingSignUp" (
    "liveTraining_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "signed_up" BOOLEAN NOT NULL DEFAULT true,
    "showed_up" BOOLEAN,

    CONSTRAINT "LiveTrainingSignUp_pkey" PRIMARY KEY ("liveTraining_id","user_id")
);
