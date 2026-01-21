-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "filePath" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL;
