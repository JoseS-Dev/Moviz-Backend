/*
  Warnings:

  - You are about to drop the column `raw_number` on the `seats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[room_id,row_number,seat_number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `row_number` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seats" DROP COLUMN "raw_number",
ADD COLUMN     "row_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "seats_room_id_row_number_seat_number_key" ON "seats"("room_id", "row_number", "seat_number");
