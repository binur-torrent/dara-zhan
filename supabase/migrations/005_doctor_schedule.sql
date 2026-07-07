-- Doctor-managed working hours.
--
-- Two layers:
-- 1. doctor_working_hours   — recurring weekly template ("I work Mon-Fri, 9-17").
-- 2. doctor_schedule_overrides — per-date exceptions that open a normally-closed
--    day, close a normally-open day, or set custom hours for one specific date.
--
-- Effective availability for a given date = override (if present) else the
-- weekly template for that weekday.

CREATE TABLE IF NOT EXISTS doctor_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday ... 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT doctor_working_hours_range_check CHECK (end_time > start_time),
  CONSTRAINT doctor_working_hours_unique_day UNIQUE (doctor_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS doctor_schedule_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT doctor_schedule_overrides_range_check CHECK (
    start_time IS NULL OR end_time IS NULL OR end_time > start_time
  ),
  CONSTRAINT doctor_schedule_overrides_unique_date UNIQUE (doctor_id, date)
);

CREATE INDEX IF NOT EXISTS idx_doctor_working_hours_doctor_id ON doctor_working_hours(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedule_overrides_doctor_date ON doctor_schedule_overrides(doctor_id, date);

ALTER TABLE doctor_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedule_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doctor_working_hours_select_public" ON doctor_working_hours;
DROP POLICY IF EXISTS "doctor_working_hours_manage_own" ON doctor_working_hours;
DROP POLICY IF EXISTS "doctor_schedule_overrides_select_public" ON doctor_schedule_overrides;
DROP POLICY IF EXISTS "doctor_schedule_overrides_manage_own" ON doctor_schedule_overrides;

-- Everyone can read schedules (needed to compute available slots for booking).
CREATE POLICY "doctor_working_hours_select_public"
  ON doctor_working_hours FOR SELECT
  TO anon, authenticated
  USING (true);

-- A doctor can fully manage only their own weekly template.
CREATE POLICY "doctor_working_hours_manage_own"
  ON doctor_working_hours FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'doctor' AND doctor_id = public.get_user_doctor_id())
  WITH CHECK (public.get_user_role() = 'doctor' AND doctor_id = public.get_user_doctor_id());

CREATE POLICY "doctor_schedule_overrides_select_public"
  ON doctor_schedule_overrides FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "doctor_schedule_overrides_manage_own"
  ON doctor_schedule_overrides FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'doctor' AND doctor_id = public.get_user_doctor_id())
  WITH CHECK (public.get_user_role() = 'doctor' AND doctor_id = public.get_user_doctor_id());

-- Seed a default Mon-Fri 09:00-17:00 template for the demo doctors so booking
-- works out of the box before any doctor logs in to customize it.
INSERT INTO doctor_working_hours (doctor_id, day_of_week, start_time, end_time)
SELECT d.id, dow, '09:00', '17:00'
FROM doctors d
CROSS JOIN generate_series(1, 5) AS dow -- Monday(1) .. Friday(5)
WHERE d.id IN (
  'a0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000002',
  'a0000000-0000-4000-8000-000000000003'
)
ON CONFLICT (doctor_id, day_of_week) DO NOTHING;
