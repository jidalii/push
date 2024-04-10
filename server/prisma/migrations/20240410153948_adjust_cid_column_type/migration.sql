/*
  Warnings:

  - Changed the type of `cid` on the `Cid` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cid" DROP COLUMN "cid",
ADD COLUMN     "cid" JSONB NOT NULL;
