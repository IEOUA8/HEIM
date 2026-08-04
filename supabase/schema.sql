-- Modelo de datos HEIM — Caminata por los animales (§12 del documento maestro).
-- Ejecutar en el SQL Editor de Supabase. Habilitar Row Level Security (§17)
-- se deja indicado al final; las políticas se definen según los roles (§11.1).

create extension if not exists "pgcrypto";

-- §12.1
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  beneficiary text,
  starts_at timestamptz,
  ends_at timestamptz,
  location_name text,
  location_url text,
  registration_deadline timestamptz,
  capacity integer,
  registration_status text default 'open',
  allow_without_pet boolean default false,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- §12.2
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  registration_code text unique not null,
  status text not null default 'ENVIADA',
  full_name text not null,
  phone_e164 text not null,
  email text,
  document_type text,
  document_number_encrypted text,
  attends_with_pet boolean not null,
  safety_accepted boolean not null,
  privacy_accepted boolean not null,
  marketing_accepted boolean default false,
  image_consent_accepted boolean default false,
  internal_attention_level text default 'normal',
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- §12.3
create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references registrations(id) on delete cascade,
  name text not null,
  breed text,
  size text,
  behavior_tags text[],
  behavior_notes text,
  health_status text,
  health_notes text,
  requires_muzzle boolean default false,
  requires_review boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- §12.4
create table if not exists registration_notes (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references registrations(id) on delete cascade,
  author_user_id uuid not null,
  note text not null,
  created_at timestamptz default now()
);

-- §12.5
create table if not exists registration_status_history (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references registrations(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by uuid,
  reason text,
  created_at timestamptz default now()
);

-- §12.6
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text not null,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- §12.7
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  ip_hash text,
  created_at timestamptz default now()
);

create index if not exists idx_registrations_event on registrations(event_id);
create index if not exists idx_registrations_status on registrations(status);
create index if not exists idx_pets_registration on pets(registration_id);

-- Habilitar RLS (§17). Definir políticas por rol antes de producción.
-- alter table registrations enable row level security;
-- alter table pets enable row level security;
-- alter table registration_notes enable row level security;
-- alter table registration_status_history enable row level security;
-- alter table audit_logs enable row level security;
