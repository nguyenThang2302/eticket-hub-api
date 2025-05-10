-- Modify "events" table
ALTER TABLE `events` MODIFY COLUMN `logo_url` text NULL COMMENT "URL of the event's logo", MODIFY COLUMN `poster_url` text NULL COMMENT "URL of the event's poster";
