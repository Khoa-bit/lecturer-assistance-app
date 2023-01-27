-- Pocketbase discussions:
-- Unique should allow empty values: https://github.com/pocketbase/pocketbase/discussions/542
-- Nulls vs "zero" values: https://github.com/pocketbase/pocketbase/discussions/1626
CREATE UNIQUE INDEX IF NOT EXISTS people_personId_uniqueHack ON people (personId)
WHERE personId != '';
CREATE UNIQUE INDEX IF NOT EXISTS people_phone_uniqueHack ON people (phone)
WHERE phone != '';
CREATE UNIQUE INDEX IF NOT EXISTS people_personalEmail_uniqueHack ON people (personalEmail)
WHERE personalEmail != '';
CREATE UNIQUE INDEX IF NOT EXISTS classes_classId_uniqueHack ON people (personId)
WHERE personId != '';
CREATE UNIQUE INDEX IF NOT EXISTS courseTemplates_courseId_uniqueHack ON people (courseId)
WHERE courseId != '';
