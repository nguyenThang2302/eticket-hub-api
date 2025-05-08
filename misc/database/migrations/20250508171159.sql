-- Modify "order_ticket_images" table
ALTER TABLE `order_ticket_images` ADD COLUMN `ticket_id` varchar(16) NULL COMMENT "Foreign key referencing the ticket associated with the image", ADD INDEX `fk_order_ticket_images_tickets` (`ticket_id`), ADD CONSTRAINT `fk_order_ticket_images_tickets` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON UPDATE CASCADE ON DELETE SET NULL;
