/*
  Warnings:

  - You are about to drop the column `public_url` on the `image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Image_public_url_key` ON `image`;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `public_url`,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL DEFAULT 'Cloudinary_Public_URL';

-- CreateIndex
CREATE UNIQUE INDEX `Image_public_id_key` ON `Image`(`public_id`);
