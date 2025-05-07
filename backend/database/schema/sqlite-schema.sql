CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "email_verified_at" datetime,
  "password" varchar not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "verification_code" varchar,
  "role" varchar not null default 'user',
  "google_id" varchar
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "jobs"(
  "id" integer primary key autoincrement not null,
  "queue" varchar not null,
  "payload" text not null,
  "attempts" integer not null,
  "reserved_at" integer,
  "available_at" integer not null,
  "created_at" integer not null
);
CREATE INDEX "jobs_queue_index" on "jobs"("queue");
CREATE TABLE IF NOT EXISTS "job_batches"(
  "id" varchar not null,
  "name" varchar not null,
  "total_jobs" integer not null,
  "pending_jobs" integer not null,
  "failed_jobs" integer not null,
  "failed_job_ids" text not null,
  "options" text,
  "cancelled_at" integer,
  "created_at" integer not null,
  "finished_at" integer,
  primary key("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs"(
  "id" integer primary key autoincrement not null,
  "uuid" varchar not null,
  "connection" text not null,
  "queue" text not null,
  "payload" text not null,
  "exception" text not null,
  "failed_at" datetime not null default CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs"("uuid");
CREATE TABLE IF NOT EXISTS "rooms"(
  "id" integer primary key autoincrement not null,
  "number" varchar not null,
  "floor" integer not null,
  "status" varchar not null default('available'),
  "is_available" tinyint(1) not null default('1'),
  "created_at" datetime,
  "updated_at" datetime,
  "price" numeric not null default('1500000'),
  "capacity" integer not null default('2'),
  "image_url" varchar
);
CREATE TABLE IF NOT EXISTS "personal_access_tokens"(
  "id" integer primary key autoincrement not null,
  "tokenable_type" varchar not null,
  "tokenable_id" integer not null,
  "name" varchar not null,
  "token" varchar not null,
  "abilities" text,
  "last_used_at" datetime,
  "expires_at" datetime,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens"(
  "tokenable_type",
  "tokenable_id"
);
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens"(
  "token"
);
CREATE TABLE IF NOT EXISTS "bookings"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NULL,
  room_id INTEGER NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT CHECK(status IN("pending", "approved", "rejected", "completed", "cancelled", "paid")) DEFAULT "pending",
  phone_number TEXT NOT NULL,
  identity_card TEXT NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT NULL,
  payment_method TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_proof TEXT NULL,
  payment_due_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO migrations VALUES(4,'2024_04_14_071436_add_verification_code_to_users_table',1);
INSERT INTO migrations VALUES(5,'2024_06_21_000000_add_role_to_users_table',1);
INSERT INTO migrations VALUES(6,'2024_06_29_000000_create_rooms_table',2);
INSERT INTO migrations VALUES(7,'2024_06_30_000000_add_room_type_fields_to_rooms_table',2);
INSERT INTO migrations VALUES(8,'2024_06_30_000001_remove_room_type_id_from_rooms_table',2);
INSERT INTO migrations VALUES(9,'2024_06_30_000002_drop_room_types_table',2);
INSERT INTO migrations VALUES(10,'2024_06_30_000003_remove_unused_columns_from_rooms_table',3);
INSERT INTO migrations VALUES(11,'2025_03_27_083307_create_personal_access_tokens_table',3);
INSERT INTO migrations VALUES(12,'2025_03_27_084509_add_role_to_users_table',4);
INSERT INTO migrations VALUES(13,'2025_03_27_084509_create_bookings_table',4);
INSERT INTO migrations VALUES(14,'2025_03_27_084509_create_room_types_table',4);
INSERT INTO migrations VALUES(15,'2025_03_27_084509_create_rooms_table',5);
INSERT INTO migrations VALUES(16,'2025_03_27_110436_add_is_available_to_rooms_table',5);
INSERT INTO migrations VALUES(17,'2025_03_27_110615_add_image_url_to_rooms_table',5);
INSERT INTO migrations VALUES(18,'2025_04_09_235959_update_bookings_status_constraint',5);
INSERT INTO migrations VALUES(19,'2025_04_23_130432_add_google_id_to_users_table',5);
INSERT INTO migrations VALUES(20,'2025_05_01_000000_drop_room_types_table_fix',6);
INSERT INTO migrations VALUES(21,'2024_05_24_000000_drop_amenity_tables',7);
