DROP DATABASE IF EXISTS `test`;
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;

# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`(
	`user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`email` varchar(50) NOT NULL DEFAULT '',
	`name` varchar(20) NOT NULL DEFAULT '',
	`profile_picture` varchar(100) NOT NULL DEFAULT '',
	`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	`delete_datetime` datetime DEFAULT NULL,
	`enable` tinyint(1) NOT NULL DEFAULT '1',
	PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Dump of table records
# ------------------------------------------------------------

DROP TABLE IF EXISTS `records`;
CREATE TABLE `records`(
	`record_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`user_id` int(11) NOT NULL DEFAULT 0,
	`start_time` datetime DEFAULT NULL,
	`end_time` datetime DEFAULT NULL,
	`duration` varchar(50) NOT NULL DEFAULT '',
	`distance` float NOT NULL DEFAULT 0,
	`blue_no` int(11) NOT NULL DEFAULT 0,
	`green_no` int(11) NOT NULL DEFAULT 0,
	`black_no` int(11) NOT NULL DEFAULT 0,
	`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	`delete_datetime` datetime DEFAULT NULL,
	`enable` tinyint(1) NOT NULL DEFAULT '1',
	PRIMARY KEY (`record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`(
	`category_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`name` varchar(50) NOT NULL DEFAULT '',
	`color` varchar(20) NOT NULL DEFAULT '',
	`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	`delete_datetime` datetime DEFAULT NULL,
	`enable` tinyint(1) NOT NULL DEFAULT '1',
	PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;