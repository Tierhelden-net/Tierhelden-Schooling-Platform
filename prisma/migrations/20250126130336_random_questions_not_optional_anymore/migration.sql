/*
  Warnings:

  - Made the column `random_questions` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "random_questions" SET NOT NULL;
