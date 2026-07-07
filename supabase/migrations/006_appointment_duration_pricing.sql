-- Snapshot the duration/price on the appointment itself at booking time.
-- This keeps historical appointments accurate even if a doctor later changes
-- their price/duration for a procedure, and lets us block out the correct
-- amount of time on the calendar for each booking.

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS price_kzt INTEGER NOT NULL DEFAULT 0;

ALTER TABLE appointments
  ADD CONSTRAINT appointments_duration_check CHECK (duration_minutes > 0),
  ADD CONSTRAINT appointments_price_check CHECK (price_kzt >= 0);

-- get_booked_slots must also return duration so the client can block out the
-- full [scheduled_at, scheduled_at + duration) range instead of only the
-- exact start time.
DROP FUNCTION IF EXISTS public.get_booked_slots(UUID);

CREATE FUNCTION public.get_booked_slots(p_doctor_id UUID)
RETURNS TABLE(scheduled_at TIMESTAMPTZ, duration_minutes INTEGER) AS $$
  SELECT a.scheduled_at, a.duration_minutes
  FROM public.appointments a
  WHERE a.doctor_id = p_doctor_id
    AND a.status IN ('pending', 'confirmed')
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_booked_slots(UUID) TO anon, authenticated;
