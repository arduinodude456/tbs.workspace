CREATE TABLE `klaroSyncItems` (
  `id` int AUTO_INCREMENT NOT NULL,
  `ownerId` int NOT NULL,
  `sourceType` enum('mail','text','photo') NOT NULL,
  `sourceId` int NOT NULL,
  `title` varchar(240) NOT NULL,
  `summary` text NOT NULL,
  `sourceUrl` varchar(1024),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `klaroSyncItems_id` PRIMARY KEY(`id`)
);
CREATE INDEX `klaroSyncItems_owner_created_idx` ON `klaroSyncItems` (`ownerId`,`createdAt`);
CREATE UNIQUE INDEX `klaroSyncItems_source_unique` ON `klaroSyncItems` (`ownerId`,`sourceType`,`sourceId`);
