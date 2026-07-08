# Dara-Zhan — Appointment System (MVP)

A simple clinic booking system with three roles: **Patient** (no account), **Nurse**, and **Doctor**.

## Features

- **Patients** — browse doctors, book appointments (no login)
- **Nurses** — review pending requests (list or weekly calendar), confirm/reject, adjust time, send manual confirmation
- **Doctors** — view confirmed schedule (list or weekly calendar), edit their own public profile (photo, specialty, bio), and configure working hours, slot interval, and lunch breaks

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL, Auth, RLS)
- React Query, Zod, React Hook Form

## Project Structure

```
src/
├── app/                    # Next.js routes
├── components/             # Shared UI + layout
├── features/               # Domain modules
│   ├── appointments/
│   ├── auth/
│   ├── dashboard/
│   └── doctors/
├── hooks/
├── lib/                    # Supabase clients, helpers
└── types/
supabase/migrations/        # SQL schema + RLS
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

3. Run migrations in the **Supabase Dashboard → SQL Editor** (in order):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
   - `supabase/migrations/003_booked_slots_rpc.sql`
   - `supabase/migrations/004_doctor_procedure_pricing.sql`
   - `supabase/migrations/005_doctor_schedule.sql`
   - `supabase/migrations/006_appointment_duration_pricing.sql`
   - `supabase/migrations/007_doctor_profile_self_service.sql`
   - `supabase/migrations/008_schedule_intervals_breaks.sql`

   **Important:** Run each file as a new query and click **Run**. Use the dashboard SQL Editor only — not the connection pooler (port `6543`), not Table Editor previews, and not read-only clients. If you see `cannot execute CREATE TYPE in a read-only transaction`, you are on a read-only connection; switch to **SQL Editor** in the left sidebar of [supabase.com/dashboard](https://supabase.com/dashboard).

### 3. Create staff users

In Supabase Auth, create users for nurse and doctor. Then link them in the `users` table:

```sql
-- Nurse
INSERT INTO users (id, role, full_name)
VALUES ('<auth-user-uuid>', 'nurse', 'Медсестра Аида');

-- Doctor (link to a doctor record)
INSERT INTO users (id, role, doctor_id, full_name)
VALUES (
  '<auth-user-uuid>',
  'doctor',
  'a0000000-0000-4000-8000-000000000001',
  'Айгерим Сулейменова'
);
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/doctors` | Doctor directory |
| `/book` | Patient booking flow |
| `/login` | Staff login |
| `/dashboard/nurse` | Nurse admin dashboard |
| `/dashboard/doctor` | Doctor schedule |

## Appointment Flow

1. Patient submits booking → status `pending`
2. Nurse reviews in dashboard → `confirmed` or `rejected`
3. Doctor sees only `confirmed` appointments

## Doctor Schedules & Pricing

- Each doctor edits their own **public profile** (`/dashboard/doctor` → "Профиль"): name, specialty, bio, and an avatar uploaded to the `doctor-avatars` Storage bucket. These fields show on the public `/doctors` page.
- Each doctor sets their own **weekly working hours** template (`/dashboard/doctor` → "Часы работы"), e.g. Mon–Fri 09:00–17:00, with an optional **per-day lunch break** that splits the day into two bookable windows.
- Each doctor picks a **slot interval** (`doctors.slot_interval_minutes`, e.g. every 15 or 30 min) that controls how far apart bookable slot start times are, independent of procedure duration.
- Doctors can add **date-specific exceptions** to close a normally-open day (vacation/sick leave) or open an extra day (weekend shift).
- Patients booking on `/book` only see time slots inside a doctor's effective working hours for each date (respecting the slot interval and lunch break), with already-booked ranges excluded.
- Each **procedure has its own price and duration per doctor** (`doctor_procedures.price_kzt` / `duration_minutes`) — the same procedure name can cost/last differently depending on who performs it. The price and duration are snapshotted onto the `appointments` row at booking time.

## Row Level Security

- `doctors`, `procedures`, `doctor_procedures` — public read; a doctor can update only their own `doctors` row
- `doctor-avatars` Storage bucket — public read; a doctor can upload/replace only files inside their own `{doctor_id}/` folder
- `doctor_working_hours`, `doctor_schedule_overrides` — public read; a doctor can manage only their own rows
- `appointments` — patients insert `pending` only; nurses read/update all; doctors read own confirmed
- `get_booked_slots()` — public RPC for slot availability (returns duration so overlapping ranges can be blocked, no patient data exposed)

## Design

Medical/calm UI following accessible healthcare patterns: soft blues, card layouts, 8px spacing grid, mobile-first, minimal animations.
