-- Modify "events" table
ALTER TABLE `events` ADD COLUMN `allow_scan_ticket` bool NOT NULL DEFAULT 0 COMMENT "Flag indicating if ticket scanning is allowed";
