/*
  Warnings:

  - Changed the type of `added_by` on the `SubjectPaperResults` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SubjectPaperResults" DROP COLUMN "added_by",
ADD COLUMN     "added_by" INTEGER NOT NULL;
