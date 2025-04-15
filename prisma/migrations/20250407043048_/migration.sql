/*
  Warnings:

  - Changed the type of `status` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('confirmed', 'pending');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('success', 'failed');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;
