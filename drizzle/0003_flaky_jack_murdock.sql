CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE INDEX `faqs_sort_idx` ON `faqs` (`sort_order`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author` text NOT NULL,
	`text` text NOT NULL,
	`rating` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE INDEX `testimonials_sort_idx` ON `testimonials` (`sort_order`);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `announcement` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `social_links` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `hidden_sections` text DEFAULT '[]' NOT NULL;