-- Modify "order_ticket_images" table
ALTER TABLE `order_ticket_images` ADD COLUMN `is_scanned` varchar(10) NULL COMMENT "Flag indicating if the ticket has been scanned";
