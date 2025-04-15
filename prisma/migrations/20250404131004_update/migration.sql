/*
  Warnings:

  - You are about to drop the column `regionId` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DestinationCategories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `countryId` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Destination" DROP CONSTRAINT "Destination_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_parentId_fkey";

-- DropForeignKey
ALTER TABLE "_DestinationCategories" DROP CONSTRAINT "_DestinationCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_DestinationCategories" DROP CONSTRAINT "_DestinationCategories_B_fkey";

-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "regionId",
ADD COLUMN     "countryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "regionId",
ADD COLUMN     "bookedSlots" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "countryId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Region";

-- DropTable
DROP TABLE "_DestinationCategories";

-- CreateTable
CREATE TABLE "Continent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Continent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "continentId" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CountryCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CountryCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CountryCategories_B_index" ON "_CountryCategories"("B");

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_continentId_fkey" FOREIGN KEY ("continentId") REFERENCES "Continent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryCategories" ADD CONSTRAINT "_CountryCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryCategories" ADD CONSTRAINT "_CountryCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
