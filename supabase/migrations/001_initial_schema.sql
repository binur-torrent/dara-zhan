-- Clinic Appointment System — initial schema + RLS
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- Do NOT use the pooler URL (port 6543) or read-only tools.

-- Doctors (public read)
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Procedures (public read)
CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Doctor ↔ Procedure mapping
CREATE TABLE IF NOT EXISTS doctor_procedures (
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, procedure_id)
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE RESTRICT,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Staff users (nurse / doctor) linked to Supabase Auth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('nurse', 'doctor')),
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT doctor_role_requires_doctor_id CHECK (
    (role = 'doctor' AND doctor_id IS NOT NULL) OR role = 'nurse'
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointments_updated_at ON appointments;
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS helper functions
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_user_doctor_id()
RETURNS UUID AS $$
  SELECT doctor_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe re-run)
DROP POLICY IF EXISTS "doctors_select_public" ON doctors;
DROP POLICY IF EXISTS "procedures_select_public" ON procedures;
DROP POLICY IF EXISTS "doctor_procedures_select_public" ON doctor_procedures;
DROP POLICY IF EXISTS "appointments_insert_pending" ON appointments;
DROP POLICY IF EXISTS "appointments_select_nurse" ON appointments;
DROP POLICY IF EXISTS "appointments_update_nurse" ON appointments;
DROP POLICY IF EXISTS "appointments_select_doctor" ON appointments;
DROP POLICY IF EXISTS "users_select_own" ON users;

-- doctors: everyone can read
CREATE POLICY "doctors_select_public"
  ON doctors FOR SELECT
  TO anon, authenticated
  USING (true);

-- procedures: everyone can read
CREATE POLICY "procedures_select_public"
  ON procedures FOR SELECT
  TO anon, authenticated
  USING (true);

-- doctor_procedures: everyone can read
CREATE POLICY "doctor_procedures_select_public"
  ON doctor_procedures FOR SELECT
  TO anon, authenticated
  USING (true);

-- appointments: patients (anon) can insert pending only
CREATE POLICY "appointments_insert_pending"
  ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- appointments: nurses read all
CREATE POLICY "appointments_select_nurse"
  ON appointments FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'nurse');

-- appointments: nurses update all
CREATE POLICY "appointments_update_nurse"
  ON appointments FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'nurse')
  WITH CHECK (public.get_user_role() = 'nurse');

-- appointments: doctors read own confirmed only
CREATE POLICY "appointments_select_doctor"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    public.get_user_role() = 'doctor'
    AND doctor_id = public.get_user_doctor_id()
    AND status = 'confirmed'
  );

-- users: read own profile
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());
