CREATE TABLE `apps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`url` varchar(2048) NOT NULL,
	`category` varchar(40) NOT NULL DEFAULT 'custom',
	`icon` varchar(40) NOT NULL DEFAULT 'grid',
	`accent` varchar(24) NOT NULL DEFAULT 'teal',
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apps_id` PRIMARY KEY(`id`)
);
