-- Modify "seats" table
ALTER TABLE `seats` ADD COLUMN `status` varchar(10) NULL COMMENT "Status of the seat (e.g., available, booked)";
