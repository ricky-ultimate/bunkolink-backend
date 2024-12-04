/*
  Warnings:

  - You are about to drop the column `metricNumber` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_metricNumber_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "metricNumber",
ADD COLUMN     "matricNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_matricNumber_key" ON "Student"("matricNumber");
