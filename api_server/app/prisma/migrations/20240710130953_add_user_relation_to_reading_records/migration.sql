/*
  Warnings:

  - Added the required column `user_id` to the `reading_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reading_records` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `reading_records` ADD CONSTRAINT `reading_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
