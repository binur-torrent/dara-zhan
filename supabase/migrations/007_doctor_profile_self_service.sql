-- Doctor self-service profile editing.
--
-- Lets a logged-in doctor update their own `doctors` row (name, specialty,
-- bio, avatar_url) and upload an avatar image to Storage. A doctor can only
-- ever touch their own row / their own avatar folder — enforced via RLS and
-- the existing get_user_doctor_id() helper.

-- A doctor can update only their own doctors row.
DROP POLICY IF EXISTS "doctors_update_own" ON doctors;
CREATE POLICY "doctors_update_own"
  ON doctors FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'doctor' AND id = public.get_user_doctor_id())
  WITH CHECK (public.get_user_role() = 'doctor' AND id = public.get_user_doctor_id());

-- Public bucket for doctor avatars. Files live under `{doctor_id}/...` so the
-- per-object policies below can match the folder to the caller's doctor_id.
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-avatars', 'doctor-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Anyone can view avatars (they show up on the public /doctors page).
DROP POLICY IF EXISTS "doctor_avatars_select_public" ON storage.objects;
CREATE POLICY "doctor_avatars_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'doctor-avatars');

-- A doctor can upload/replace/delete only files inside their own folder,
-- i.e. the first path segment equals their doctor_id.
DROP POLICY IF EXISTS "doctor_avatars_insert_own" ON storage.objects;
CREATE POLICY "doctor_avatars_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'doctor-avatars'
    AND public.get_user_role() = 'doctor'
    AND (storage.foldername(name))[1] = public.get_user_doctor_id()::text
  );

DROP POLICY IF EXISTS "doctor_avatars_update_own" ON storage.objects;
CREATE POLICY "doctor_avatars_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'doctor-avatars'
    AND public.get_user_role() = 'doctor'
    AND (storage.foldername(name))[1] = public.get_user_doctor_id()::text
  )
  WITH CHECK (
    bucket_id = 'doctor-avatars'
    AND public.get_user_role() = 'doctor'
    AND (storage.foldername(name))[1] = public.get_user_doctor_id()::text
  );

DROP POLICY IF EXISTS "doctor_avatars_delete_own" ON storage.objects;
CREATE POLICY "doctor_avatars_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'doctor-avatars'
    AND public.get_user_role() = 'doctor'
    AND (storage.foldername(name))[1] = public.get_user_doctor_id()::text
  );
