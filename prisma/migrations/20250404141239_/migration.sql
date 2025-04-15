/*
  Warnings:

  - Added the required column `description` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "description" TEXT NOT NULL;
