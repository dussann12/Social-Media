/*
  Warnings:

  - You are about to drop the column `reciverId` on the `Friendship` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Friendship" DROP CONSTRAINT "Friendship_reciverId_fkey";

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "reciverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
