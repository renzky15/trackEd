/*
  Warnings:

  - A unique constraint covering the columns `[lrnId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lrnId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lrnId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_lrnId_key" ON "User"("lrnId");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
