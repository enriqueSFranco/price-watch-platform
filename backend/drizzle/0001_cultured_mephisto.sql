DROP INDEX "url_idx";--> statement-breakpoint
CREATE INDEX "user_url_idx" ON "products" USING btree ("user_id","url");