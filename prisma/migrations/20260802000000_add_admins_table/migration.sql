-- CreateTable
-- IF NOT EXISTS because the Admins model was added to schema.prisma without a
-- migration, so the table may already exist on servers set up with `db push`.
CREATE TABLE IF NOT EXISTS `Admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
