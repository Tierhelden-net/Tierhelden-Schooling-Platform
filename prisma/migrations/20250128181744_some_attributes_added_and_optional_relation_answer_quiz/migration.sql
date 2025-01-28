-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "quiz_id" INTEGER;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "position" INTEGER,
ADD COLUMN     "random_answers" BOOLEAN DEFAULT false,
ALTER COLUMN "points" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_chapter_completed" TIMESTAMP(3),
ADD COLUMN     "last_live_training" TIMESTAMP(3),
ADD COLUMN     "last_online_training" TIMESTAMP(3),
ADD COLUMN     "last_signed_in" TIMESTAMP(3);
