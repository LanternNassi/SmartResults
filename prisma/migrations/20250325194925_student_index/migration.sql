/*
  Warnings:

  - A unique constraint covering the columns `[indexNo]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indexNo` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "indexNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_indexNo_key" ON "Student"("indexNo");
