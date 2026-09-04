CREATE TABLE `mailMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`senderName` varchar(160) NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`recipientName` varchar(160) NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(240) NOT NULL,
	`body` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	`isStarred` int NOT NULL DEFAULT 0,
	CONSTRAINT `mailMessages_id` PRIMARY KEY(`id`)
);
