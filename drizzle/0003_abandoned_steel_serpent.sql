CREATE TABLE `blepharoplasty_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`telefono` varchar(64) NOT NULL,
	`email` varchar(320),
	`mensaje` text,
	`status` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blepharoplasty_leads_id` PRIMARY KEY(`id`)
);
