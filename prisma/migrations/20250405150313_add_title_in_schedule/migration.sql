/*
  Warnings:

  - Added the required column `title` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "title" TEXT NOT NULL;
