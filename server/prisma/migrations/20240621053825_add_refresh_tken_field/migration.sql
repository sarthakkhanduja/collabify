/*
  Warnings:

  - You are about to drop the column `channelLink` on the `Creator` table. All the data in the column will be lost.
  - Added the required column `channelName` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "channelLink",
ADD COLUMN     "channelName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refresh_token" TEXT NOT NULL;
