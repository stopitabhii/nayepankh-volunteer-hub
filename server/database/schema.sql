-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ========================================
-- ENUM TYPES
-- ========================================
create type user_role as enum ('volunteer', 'admin');
create type volunteer_status as enum ('pending', 'approved', 'rejected');
create type application_status as enum ('pending', 'approved', 'rejected', 'completed');

-- ========================================
-- USERS (core auth identity, shared by volunteers + admins)
-- ========================================
create table users (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  email varchar(160) unique not null,
  password_hash text not null,
  phone varchar(20),
  avatar_url text,
  role user_role not null default 'volunteer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- VOLUNTEERS (1:1 extension of users — extended profile + verification)
-- ========================================
create table volunteers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  bio text,
  skills text[] default '{}',
  availability varchar(120),
  id_card_url text,
  document_url text,
  status volunteer_status not null default 'pending',
  total_hours numeric(6,2) not null default 0,
  reviewed_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- EVENTS
-- ========================================
create table events (
  id uuid primary key default gen_random_uuid(),
  title varchar(160) not null,
  description text,
  category varchar(60),
  location varchar(160),
  image_url text,
  event_date timestamptz not null,
  capacity integer not null default 0,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- VOLUNTEER APPLICATIONS (junction table: volunteer <-> event)
-- ========================================
create table volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status application_status not null default 'pending',
  hours_logged numeric(6,2) not null default 0,
  motivation text,
  reviewed_by uuid references users(id) on delete set null,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (volunteer_id, event_id)
);

-- ========================================
-- CONTACT MESSAGES (standalone inbox, no FK needed)
-- ========================================
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  email varchar(160) not null,
  subject varchar(200),
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ========================================
-- REPORTS (aggregated analytics snapshots)
-- ========================================
create table reports (
  id uuid primary key default gen_random_uuid(),
  type varchar(60) not null,
  generated_by uuid references users(id) on delete set null,
  date_range_start date,
  date_range_end date,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ========================================
-- INDEXES (query performance for common lookups)
-- ========================================
create index idx_volunteers_status on volunteers(status);
create index idx_events_date on events(event_date);
create index idx_applications_status on volunteer_applications(status);
create index idx_applications_event on volunteer_applications(event_id);
create index idx_contact_resolved on contact_messages(resolved);

-- ========================================
-- AUTO-UPDATE updated_at ON EVERY UPDATE
-- ========================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();
create trigger trg_volunteers_updated_at before update on volunteers
  for each row execute function set_updated_at();
create trigger trg_events_updated_at before update on events
  for each row execute function set_updated_at();
create trigger trg_applications_updated_at before update on volunteer_applications
  for each row execute function set_updated_at();