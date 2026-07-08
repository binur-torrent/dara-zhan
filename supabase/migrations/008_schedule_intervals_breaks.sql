-- Configurable booking slot interval + per-day lunch break.
--
-- 1. slot_interval_minutes (per doctor): how far apart bookable slot start
--    times are (e.g. every 15 or 30 min), independent of procedure duration.
-- 2. break_start_time / break_end_time (per weekday): an optional lunch break
--    that splits a working day into two bookable windows.

ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS slot_interval_minutes INTEGER NOT NULL DEFAULT 30;

ALTER TABLE doctors
  DROP CONSTRAINT IF EXISTS doctors_slot_interval_check;
ALTER TABLE doctors
  ADD CONSTRAINT doctors_slot_interval_check
    CHECK (slot_interval_minutes IN (10, 15, 20, 30, 45, 60));

ALTER TABLE doctor_working_hours
  ADD COLUMN IF NOT EXISTS break_start_time TIME,
  ADD COLUMN IF NOT EXISTS break_end_time TIME;

ALTER TABLE doctor_working_hours
  DROP CONSTRAINT IF EXISTS doctor_working_hours_break_check;
ALTER TABLE doctor_working_hours
  ADD CONSTRAINT doctor_working_hours_break_check CHECK (
    (break_start_time IS NULL AND break_end_time IS NULL)
    OR (
      break_start_time IS NOT NULL
      AND break_end_time IS NOT NULL
      AND break_end_time > break_start_time
      AND break_start_time >= start_time
      AND break_end_time <= end_time
    )
  );
