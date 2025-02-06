/*
  Warnings:

  - A unique constraint covering the columns `[public_url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `image` ADD COLUMN `public_url` VARCHAR(191) NOT NULL DEFAULT 'Cloudinary_Public_URL';

-- CreateIndex
CREATE UNIQUE INDEX `Image_public_url_key` ON `Image`(`public_url`);
