ALTER TABLE `site_settings` ADD `google_rating` real;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `google_rating_count` integer;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `google_reviews_url` text DEFAULT '' NOT NULL;