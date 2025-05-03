-- Modify "events" table
ALTER TABLE `events` ADD COLUMN `seats` text NULL COMMENT "JSON representation of the seats associated with the event";
