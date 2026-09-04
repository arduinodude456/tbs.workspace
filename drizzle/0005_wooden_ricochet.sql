ALTER TABLE `users` ADD `tbsAddress` varchar(160);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_tbsAddress_unique` UNIQUE(`tbsAddress`);