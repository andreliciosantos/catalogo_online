/*
  Warnings:

  - A unique constraint covering the columns `[ean]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Made the column `ean` on table `Produto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
ALTER COLUMN "ean" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Produto_ean_key" ON "Produto"("ean");
