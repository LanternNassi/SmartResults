/*
  Warnings:

  - You are about to drop the column `paper` on the `SubjectPaperResults` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `SubjectPaperResults` table. All the data in the column will be lost.
  - Added the required column `added_by` to the `SubjectPaperResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectpaperId` to the `SubjectPaperResults` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubjectPaperResults" DROP CONSTRAINT "SubjectPaperResults_subjectId_fkey";

-- AlterTable
ALTER TABLE "SubjectPaperResults" DROP COLUMN "paper",
DROP COLUMN "subjectId",
ADD COLUMN     "added_by" TEXT NOT NULL,
ADD COLUMN     "subjectpaperId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectPaperResults" ADD CONSTRAINT "SubjectPaperResults_subjectpaperId_fkey" FOREIGN KEY ("subjectpaperId") REFERENCES "SubjectPapers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
