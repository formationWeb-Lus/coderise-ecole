/*
  Warnings:

  - Made the column `content` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "content" SET NOT NULL;
