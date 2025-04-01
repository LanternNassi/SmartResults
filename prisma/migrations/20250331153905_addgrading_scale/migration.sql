-- CreateTable
CREATE TABLE "GradeSystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GradeSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeRange" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "gradeSystemId" INTEGER NOT NULL,

    CONSTRAINT "GradeRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeSystem_name_key" ON "GradeSystem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GradeRange_gradeSystemId_grade_key" ON "GradeRange"("gradeSystemId", "grade");

-- AddForeignKey
ALTER TABLE "GradeRange" ADD CONSTRAINT "GradeRange_gradeSystemId_fkey" FOREIGN KEY ("gradeSystemId") REFERENCES "GradeSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
