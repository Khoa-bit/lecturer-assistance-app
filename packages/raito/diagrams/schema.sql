CREATE TABLE `_migrations` (file VARCHAR(255) PRIMARY KEY NOT NULL, applied INTEGER NOT NULL);
CREATE TABLE `_admins` (
				`id`              TEXT PRIMARY KEY NOT NULL,
				`avatar`          INTEGER DEFAULT 0 NOT NULL,
				`email`           TEXT UNIQUE NOT NULL,
				`tokenKey`        TEXT UNIQUE NOT NULL,
				`passwordHash`    TEXT NOT NULL,
				`lastResetSentAt` TEXT DEFAULT "" NOT NULL,
				`created`         TEXT DEFAULT "" NOT NULL,
				`updated`         TEXT DEFAULT "" NOT NULL
			);
CREATE TABLE `_collections` (
				`id`         TEXT PRIMARY KEY NOT NULL,
				`system`     BOOLEAN DEFAULT FALSE NOT NULL,
				`type`       TEXT DEFAULT "base" NOT NULL,
				`name`       TEXT UNIQUE NOT NULL,
				`schema`     JSON DEFAULT "[]" NOT NULL,
				`listRule`   TEXT DEFAULT NULL,
				`viewRule`   TEXT DEFAULT NULL,
				`createRule` TEXT DEFAULT NULL,
				`updateRule` TEXT DEFAULT NULL,
				`deleteRule` TEXT DEFAULT NULL,
				`options`    JSON DEFAULT "{}" NOT NULL,
				`created`    TEXT DEFAULT "" NOT NULL,
				`updated`    TEXT DEFAULT "" NOT NULL
			);
CREATE TABLE `_params` (
				`id`      TEXT PRIMARY KEY NOT NULL,
				`key`     TEXT UNIQUE NOT NULL,
				`value`   JSON DEFAULT NULL,
				`created` TEXT DEFAULT "" NOT NULL,
				`updated` TEXT DEFAULT "" NOT NULL
			);
CREATE TABLE `_externalAuths` (
				`id`           TEXT PRIMARY KEY NOT NULL,
				`collectionId` TEXT NOT NULL,
				`recordId`     TEXT NOT NULL,
				`provider`     TEXT NOT NULL,
				`providerId`   TEXT NOT NULL,
				`created`      TEXT DEFAULT "" NOT NULL,
				`updated`      TEXT DEFAULT "" NOT NULL,
				---
				FOREIGN KEY (`collectionId`) REFERENCES `_collections` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
			);
CREATE UNIQUE INDEX _externalAuths_record_provider_idx on `_externalAuths` (`collectionId`, `recordId`, `provider`);
CREATE UNIQUE INDEX _externalAuths_provider_providerId_idx on `_externalAuths` (`provider`, `providerId`);
CREATE TABLE `users` (`created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `lastResetSentAt` TEXT DEFAULT '' NOT NULL, `lastVerificationSentAt` TEXT DEFAULT '' NOT NULL, `passwordHash` TEXT NOT NULL, `tokenKey` TEXT NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `username` TEXT NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL, "person" TEXT DEFAULT '');
CREATE INDEX `__pb_users_auth__created_idx` ON `users` (`created`);
CREATE UNIQUE INDEX __pb_users_auth__username_idx ON `users` (`username`);
CREATE UNIQUE INDEX __pb_users_auth__email_idx ON `users` (`email`) WHERE `email` != '';
CREATE UNIQUE INDEX __pb_users_auth__tokenKey_idx ON `users` (`tokenKey`);
CREATE TABLE `attachments` (`created` TEXT DEFAULT '' NOT NULL, `document` TEXT DEFAULT '', `file` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_e8b4edpfxo6tszo_created_idx` ON `attachments` (`created`);
CREATE TABLE `classes` (`classId` TEXT DEFAULT '', `cohort` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, "major" TEXT DEFAULT '', "fullDocument" TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `trainingSystem` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_lbkbtnakhaudvls_created_idx` ON `classes` (`created`);
CREATE TABLE `courseTemplates` (`courseId` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `periodsCount` REAL DEFAULT 0, `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_w1u7k3atie2fwvi_created_idx` ON `courseTemplates` (`created`);
CREATE TABLE `courses` (`courseTemplate` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, "fullDocument" TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `semester` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_2vda8dzur6jhdxy_created_idx` ON `courses` (`created`);
CREATE TABLE `departments` (`created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_rncqe4klgabuo3x_created_idx` ON `departments` (`created`);
CREATE TABLE `documents` (`created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `priority` TEXT DEFAULT '', `status` TEXT DEFAULT '', `thumbnail` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "diffHash" TEXT DEFAULT '', "owner" TEXT DEFAULT '', "deleted" TEXT DEFAULT '', "richText" TEXT DEFAULT '', "attachmentsHash" TEXT DEFAULT '');
CREATE INDEX `_j4ausx28rc681dq_created_idx` ON `documents` (`created`);
CREATE TABLE `eventDocuments` (`created` TEXT DEFAULT '' NOT NULL, `endTime` TEXT DEFAULT '', `fullDocument` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `startTime` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "recurring" TEXT DEFAULT '', "toFullDocument" TEXT DEFAULT '');
CREATE INDEX `_fdvpbps19x0r7r0_created_idx` ON `eventDocuments` (`created`);
CREATE TABLE `fullDocuments` (`created` TEXT DEFAULT '' NOT NULL, `document` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, "internal" TEXT DEFAULT '');
CREATE INDEX `_gcqfd846lugrlnj_created_idx` ON `fullDocuments` (`created`);
CREATE TABLE `majors` (`created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "department" TEXT DEFAULT '');
CREATE INDEX `_8qzwbi8qig96dy3_created_idx` ON `majors` (`created`);
CREATE TABLE `participants` (`created` TEXT DEFAULT '' NOT NULL, `document` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `note` TEXT DEFAULT '', `permission` TEXT DEFAULT '', `person` TEXT DEFAULT '', `role` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_d1gfoputrdow7mx_created_idx` ON `participants` (`created`);
CREATE TABLE `people` (`avatar` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, `deleted` TEXT DEFAULT '', "major" TEXT DEFAULT '', `gender` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `personId` TEXT DEFAULT '', `personalEmail` TEXT DEFAULT '', `phone` TEXT DEFAULT '', `placeOfBirth` TEXT DEFAULT '', `title` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "isAdvisor" BOOLEAN DEFAULT FALSE, "isLecturer" BOOLEAN DEFAULT FALSE);
CREATE INDEX `_vks6ezu0clb3qja_created_idx` ON `people` (`created`);
CREATE TABLE IF NOT EXISTS "relationships" (`created` TEXT DEFAULT '' NOT NULL, `fromPerson` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `toPerson` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_q22h280gruk59ry_created_idx` ON "relationships" (`created`);
CREATE TABLE `personalNotes` (`created` TEXT DEFAULT '' NOT NULL, `fullDocument` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_fewbiz09m7bi4kg_created_idx` ON `personalNotes` (`created`);
CREATE TABLE `academicMaterials` (`category` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, `fullDocument` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE INDEX `_ykaefycx2ie9dtn_created_idx` ON `academicMaterials` (`created`);
