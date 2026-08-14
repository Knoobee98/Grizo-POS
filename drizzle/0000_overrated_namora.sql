CREATE TABLE "attendance_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"employee_name" text NOT NULL,
	"date" text NOT NULL,
	"check_in_time" text NOT NULL,
	"check_out_time" text,
	"status" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subtitle" text,
	"sku" text NOT NULL,
	"category" text NOT NULL,
	"item_type" text DEFAULT 'Barang' NOT NULL,
	"price" numeric NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"low_stock_threshold" integer DEFAULT 10,
	"image" text,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "store_config" (
	"id" text PRIMARY KEY DEFAULT 'main_store' NOT NULL,
	"store_name" text NOT NULL,
	"store_branch" text,
	"address" text,
	"phone" text,
	"tax_rate" numeric,
	"currency_symbol" text,
	"receipt_footer" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_no" text NOT NULL,
	"cashier_id" text NOT NULL,
	"cashier_name" text NOT NULL,
	"customer_name" text,
	"payment_method" text NOT NULL,
	"status" text NOT NULL,
	"subtotal" numeric NOT NULL,
	"tax" numeric NOT NULL,
	"discount" numeric DEFAULT '0',
	"total" numeric NOT NULL,
	"amount_tendered" numeric,
	"change_due" numeric,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_ticket_no_unique" UNIQUE("ticket_no")
);
