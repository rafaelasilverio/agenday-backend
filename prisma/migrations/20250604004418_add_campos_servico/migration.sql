/*
  Warnings:

  - Added the required column `category` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;
