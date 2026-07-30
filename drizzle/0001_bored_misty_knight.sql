CREATE TABLE `translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locale` text NOT NULL,
	`namespace` text NOT NULL,
	`ref_id` integer DEFAULT 0 NOT NULL,
	`field` text NOT NULL,
	`value` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translations_unique_idx` ON `translations` (`locale`,`namespace`,`ref_id`,`field`);--> statement-breakpoint
CREATE INDEX `translations_lookup_idx` ON `translations` (`locale`,`namespace`);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `enabled_locales` text DEFAULT '[]' NOT NULL;