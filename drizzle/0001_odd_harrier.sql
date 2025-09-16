CREATE TABLE "creditUsage" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"creditsUsed" integer DEFAULT 1 NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "credits" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "creditUsage" ADD CONSTRAINT "creditUsage_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;