-- AlterTable
ALTER TABLE `papers` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Uploaded. Waiting to start the review process';
