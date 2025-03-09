-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS';
