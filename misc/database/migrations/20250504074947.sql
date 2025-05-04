-- Modify "coupons" table
ALTER TABLE `coupons` ADD COLUMN `status` varchar(10) NULL COMMENT "Status of the coupon (e.g., active, expired)";
