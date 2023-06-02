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
			, `indexes` JSON DEFAULT "[]" NOT NULL);
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
CREATE TABLE `users` (`created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `lastResetSentAt` TEXT DEFAULT '' NOT NULL, `lastVerificationSentAt` TEXT DEFAULT '' NOT NULL, `passwordHash` TEXT NOT NULL, `tokenKey` TEXT NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `username` TEXT NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL, "person" TEXT DEFAULT '', "justRegistered" BOOLEAN DEFAULT FALSE);
CREATE UNIQUE INDEX __pb_users_auth__username_idx ON `users` (`username`);
CREATE UNIQUE INDEX __pb_users_auth__email_idx ON `users` (`email`) WHERE `email` != '';
CREATE UNIQUE INDEX __pb_users_auth__tokenKey_idx ON `users` (`tokenKey`);
CREATE TABLE `attachments` (`created` TEXT DEFAULT '' NOT NULL, `document` TEXT DEFAULT '', `file` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `classes` (`classId` TEXT DEFAULT '', `cohort` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, "major" TEXT DEFAULT '', "fullDocument" TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, "academicProgram" TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `courseTemplates` (`courseId` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `periodsCount` REAL DEFAULT 0, `updated` TEXT DEFAULT '' NOT NULL, "academicProgram" TEXT DEFAULT '');
CREATE TABLE `courses` (`courseTemplate` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, "fullDocument" TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `semester` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `departments` (`created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "departmentId" TEXT DEFAULT '');
CREATE TABLE `documents` (`created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `priority` TEXT DEFAULT '', `status` TEXT DEFAULT '', `thumbnail` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "diffHash" TEXT DEFAULT '', "owner" TEXT DEFAULT '', "deleted" TEXT DEFAULT '', "richText" TEXT DEFAULT '', "attachmentsHash" TEXT DEFAULT '', "startTime" TEXT DEFAULT '', "endTime" TEXT DEFAULT '', "description" TEXT DEFAULT '');
CREATE TABLE `eventDocuments` (`created` TEXT DEFAULT '' NOT NULL, `fullDocument` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, "recurring" TEXT DEFAULT '', "toFullDocument" TEXT DEFAULT '', "reminderAt" TEXT DEFAULT '');
CREATE TABLE `fullDocuments` (`created` TEXT DEFAULT '' NOT NULL, `document` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, "internal" TEXT DEFAULT '');
CREATE TABLE `majors` (`created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "department" TEXT DEFAULT '', "majorId" TEXT DEFAULT '');
CREATE TABLE `participants` (`created` TEXT DEFAULT '' NOT NULL, `document` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `note` TEXT DEFAULT '', `permission` TEXT DEFAULT '', `person` TEXT DEFAULT '', `role` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "status" TEXT DEFAULT '');
CREATE TABLE `people` (`avatar` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, `deleted` TEXT DEFAULT '', "major" TEXT DEFAULT '', `gender` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `name` TEXT DEFAULT '', `personId` TEXT DEFAULT '', `personalEmail` TEXT DEFAULT '', `phone` TEXT DEFAULT '', `placeOfBirth` TEXT DEFAULT '', `title` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL, "thumbnail" TEXT DEFAULT '', "interests" JSON DEFAULT NULL, "contactRoom" TEXT DEFAULT '', "contactLocation" TEXT DEFAULT '', "experience" JSON DEFAULT NULL, "education" JSON DEFAULT NULL, "isFaculty" BOOLEAN DEFAULT FALSE, "hasAccount" BOOLEAN DEFAULT FALSE, "dayOfBirth" TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS "relationships" (`created` TEXT DEFAULT '' NOT NULL, `fromPerson` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `toPerson` TEXT DEFAULT '', `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `personalNotes` (`created` TEXT DEFAULT '' NOT NULL, `fullDocument` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `academicMaterials` (`category` TEXT DEFAULT '', `created` TEXT DEFAULT '' NOT NULL, `fullDocument` TEXT DEFAULT '', `id` TEXT PRIMARY KEY NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE sqlite_stat1(tbl,idx,stat);
CREATE INDEX `_e8b4edpfxo6tszo_created_idx` ON `attachments` (`created`);
CREATE INDEX `_lbkbtnakhaudvls_created_idx` ON `classes` (`created`);
CREATE UNIQUE INDEX `idx_unique_wdhjxrtl` ON `classes` (`fullDocument`);
CREATE INDEX `_w1u7k3atie2fwvi_created_idx` ON `courseTemplates` (`created`);
CREATE UNIQUE INDEX `idx_unique_oqr2aiwj` ON `courseTemplates` (`name`);
CREATE INDEX `_2vda8dzur6jhdxy_created_idx` ON `courses` (`created`);
CREATE UNIQUE INDEX `idx_unique_vtbu4ebk` ON `courses` (`fullDocument`);
CREATE INDEX `_j4ausx28rc681dq_created_idx` ON `documents` (`created`);
CREATE INDEX `_gcqfd846lugrlnj_created_idx` ON `fullDocuments` (`created`);
CREATE UNIQUE INDEX `idx_unique_fqz8anf2` ON `fullDocuments` (`document`);
CREATE INDEX `_q22h280gruk59ry_created_idx` ON `relationships` (`created`);
CREATE INDEX `_fewbiz09m7bi4kg_created_idx` ON `personalNotes` (`created`);
CREATE UNIQUE INDEX `idx_unique_xu7lw6et` ON `personalNotes` (`fullDocument`);
CREATE INDEX `_ykaefycx2ie9dtn_created_idx` ON `academicMaterials` (`created`);
CREATE UNIQUE INDEX `idx_unique_gy4j389h` ON `academicMaterials` (`fullDocument`);
CREATE TABLE `services` (`created` TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `lastResetSentAt` TEXT DEFAULT '' NOT NULL, `lastVerificationSentAt` TEXT DEFAULT '' NOT NULL, `passwordHash` TEXT NOT NULL, `tokenKey` TEXT NOT NULL, `updated` TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL, `username` TEXT NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL);
CREATE UNIQUE INDEX _s6k8xiqz09qxjd6_username_idx ON `services` (`username`);
CREATE UNIQUE INDEX _s6k8xiqz09qxjd6_email_idx ON `services` (`email`) WHERE `email` != '';
CREATE UNIQUE INDEX _s6k8xiqz09qxjd6_tokenKey_idx ON `services` (`tokenKey`);
CREATE INDEX `_fdvpbps19x0r7r0_created_idx` ON `eventDocuments` (`created`);
CREATE UNIQUE INDEX `idx_unique_tha3swja` ON `eventDocuments` (`fullDocument`);
CREATE INDEX `idx_UKGxIUL` ON `eventDocuments` (`reminderAt`);
CREATE INDEX `__pb_users_auth__created_idx` ON `users` (`created`);
CREATE UNIQUE INDEX `idx_os4kHmJ` ON `users` (`person`);
CREATE VIEW `reminders` AS SELECT * FROM (SELECT 
	ed.id,
	ed.reminderAt,
	fullDocument.id fullDocument_id,
	fullDocument.internal fullDocument_internal,
	fullDocument_document.name fullDocument_document_name,
	fullDocument_document.priority fullDocument_document_priority,
	fullDocument_document.status fullDocument_document_status,
	fullDocument_document.startTime fullDocument_document_startTime,
	fullDocument_document.endTime fullDocument_document_endTime,
	fullDocument_document.description fullDocument_document_description,
	fullDocument_document_owner.name fullDocument_document_owner_name,
	toFullDocument.id toFullDocument_id,
	toFullDocument.internal toFullDocument_internal,
	toFullDocument_document.name toFullDocument_document_name,
	toFullDocument_document.priority toFullDocument_document_priority,
	toFullDocument_document.status toFullDocument_document_status,
	toFullDocument_document.startTime toFullDocument_document_startTime,
	toFullDocument_document.endTime toFullDocument_document_endTime,
	toFullDocument_document.description toFullDocument_document_description,
	toFullDocument_document_owner.name toFullDocument_document_owner_name,
	GROUP_CONCAT(COALESCE(IFNULL(u.email, person.personalEmail), ''), ', ') AS allParticipantsEmails
FROM eventDocuments ed 
INNER JOIN fullDocuments fullDocument ON fullDocument.id = ed.fullDocument 
INNER JOIN documents fullDocument_document ON fullDocument_document.id = fullDocument.document AND fullDocument_document.deleted == ''
LEFT JOIN people fullDocument_document_owner ON fullDocument_document_owner.id = fullDocument_document.owner
LEFT JOIN fullDocuments toFullDocument ON toFullDocument.id = ed.toFullDocument
LEFT JOIN documents toFullDocument_document  ON toFullDocument_document.id = toFullDocument.document AND toFullDocument_document.deleted == ''
LEFT JOIN people toFullDocument_document_owner ON toFullDocument_document_owner.id = toFullDocument_document.owner 
INNER JOIN participants p ON p.document = fullDocument_document.id
LEFT JOIN users u ON u.person = p.person 
LEFT JOIN people person ON person.id = p.person
WHERE ed.reminderAt <> '' AND ed.reminderAt < DATETIME()
)
/* reminders(id,reminderAt,fullDocument_id,fullDocument_internal,fullDocument_document_name,fullDocument_document_priority,fullDocument_document_status,fullDocument_document_startTime,fullDocument_document_endTime,fullDocument_document_description,fullDocument_document_owner_name,toFullDocument_id,toFullDocument_internal,toFullDocument_document_name,toFullDocument_document_priority,toFullDocument_document_status,toFullDocument_document_startTime,toFullDocument_document_endTime,toFullDocument_document_description,toFullDocument_document_owner_name,allParticipantsEmails) */;
CREATE INDEX `_rncqe4klgabuo3x_created_idx` ON `departments` (`created`);
CREATE UNIQUE INDEX `idx_unique_cl2agxi7` ON `departments` (`name`);
CREATE UNIQUE INDEX `idx_gOqw0SB` ON `departments` (`departmentId`);
CREATE INDEX `_vks6ezu0clb3qja_created_idx` ON `people` (`created`);
CREATE INDEX `idx_Yld9cDf` ON `people` (`personId`);
CREATE INDEX `_8qzwbi8qig96dy3_created_idx` ON `majors` (`created`);
CREATE UNIQUE INDEX `idx_9MfZX1c` ON `majors` (`majorId`);
CREATE INDEX `_d1gfoputrdow7mx_created_idx` ON `participants` (`created`);
