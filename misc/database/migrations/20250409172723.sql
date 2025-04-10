-- Modify "tickets" table
ALTER TABLE `tickets` DROP COLUMN `amount`;
-- Modify "event_seats" table
ALTER TABLE `event_seats` DROP COLUMN `name`, DROP COLUMN `seat_map_data`, ADD COLUMN `ticket_id` varchar(16) NULL COMMENT "Identifier of the ticket associated with the seat", ADD COLUMN `row` varchar(255) NULL COMMENT "Row identifier for the seat", ADD COLUMN `label` varchar(255) NULL COMMENT "Label for the seat", ADD COLUMN `type` varchar(255) NULL COMMENT "Type of the seat (e.g., VIP, Regular)", ADD COLUMN `status` varchar(10) NULL COMMENT "Status of the seat (e.g., available, booked)", ADD INDEX `fk_event_seats_tickets` (`ticket_id`), ADD CONSTRAINT `fk_event_seats_tickets` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON UPDATE CASCADE ON DELETE SET NULL;
-- Modify "ticket_events" table
ALTER TABLE `ticket_events` DROP COLUMN `organization_ticket_id`, ADD COLUMN `ticket_id` varchar(16) NOT NULL COMMENT "Identifier of the ticket", ADD INDEX `fk_ticket_events_tickets` (`ticket_id`), DROP FOREIGN KEY `fk_ticket_events_organization_tickets`, ADD CONSTRAINT `fk_ticket_events_tickets` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;
-- Drop "organization_tickets" table
DROP TABLE `organization_tickets`;
