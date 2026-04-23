/*
  Warnings:

  - Made the column `folderId` on table `CodeFile` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `CodeFolder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CodeFile" DROP CONSTRAINT "CodeFile_folderId_fkey";

-- DropForeignKey
ALTER TABLE "CodeFile" DROP CONSTRAINT "CodeFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "CodeFolder" DROP CONSTRAINT "CodeFolder_userId_fkey";

-- AlterTable
ALTER TABLE "CodeFile" ALTER COLUMN "folderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CodeFolder" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "CodeFolder" ADD CONSTRAINT "CodeFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeFile" ADD CONSTRAINT "CodeFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeFile" ADD CONSTRAINT "CodeFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "CodeFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
