/*
  Warnings:

  - You are about to drop the column `criadoEm` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `imagemUrl` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "criadoEm",
DROP COLUMN "imagemUrl",
DROP COLUMN "nome",
ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "ean" TEXT,
ADD COLUMN     "imagens" TEXT[];
