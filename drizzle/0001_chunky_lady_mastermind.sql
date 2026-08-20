CREATE TABLE `clinic_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('hero','doctor','clinic','texture','gallery') NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`filename` varchar(255),
	`mimeType` varchar(64),
	`sizeBytes` int,
	`active` enum('yes','no') NOT NULL DEFAULT 'yes',
	`uploadedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clinic_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`telefono` varchar(64) NOT NULL,
	`email` varchar(320),
	`consulta` varchar(64),
	`status` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
