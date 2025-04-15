/*
  Warnings:

  - Added the required column `regionId` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "regionId" TEXT NOT NULL;
