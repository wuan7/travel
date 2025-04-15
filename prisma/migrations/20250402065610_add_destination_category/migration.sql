/*
  Warnings:

  - You are about to drop the `DestinationCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DestinationCategory" DROP CONSTRAINT "DestinationCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "DestinationCategory" DROP CONSTRAINT "DestinationCategory_destinationId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropTable
DROP TABLE "DestinationCategory";

-- CreateTable
CREATE TABLE "_DestinationCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DestinationCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DestinationCategories_B_index" ON "_DestinationCategories"("B");

-- AddForeignKey
ALTER TABLE "_DestinationCategories" ADD CONSTRAINT "_DestinationCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationCategories" ADD CONSTRAINT "_DestinationCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
