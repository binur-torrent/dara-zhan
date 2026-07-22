-- Nurse direct booking.
--
-- Lets a logged-in nurse create appointments directly from the dashboard with
-- any status (e.g. an already-confirmed appointment), instead of being limited
-- to the anon `pending`-only insert path used by the public /book form.
--
-- The existing "appointments_insert_pending" policy stays in place for the
-- public booking flow. Postgres combines multiple permissive INSERT policies
-- with OR, so anon/patients keep inserting `pending` rows while nurses may
-- insert rows in any status. Doctors still cannot insert (read-only).

DROP POLICY IF EXISTS "appointments_insert_nurse" ON appointments;
CREATE POLICY "appointments_insert_nurse"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'nurse');
