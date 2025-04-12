-- Modify "orders" table
ALTER TABLE `orders` ADD COLUMN `seat_info` text NULL COMMENT "Information about the seats associated with the order";
