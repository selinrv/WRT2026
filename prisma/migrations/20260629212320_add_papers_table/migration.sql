-- CreateTable
CREATE TABLE `papers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `co_authors` LONGTEXT NULL,
    `organization` LONGTEXT NULL,
    `paper_title` LONGTEXT NOT NULL,
    `manuscript_link` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

