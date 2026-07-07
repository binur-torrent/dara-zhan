-- Public function to check booked slots without exposing patient data
CREATE OR REPLACE FUNCTION public.get_booked_slots(p_doctor_id UUID)
RETURNS TABLE(scheduled_at TIMESTAMPTZ) AS $$
  SELECT a.scheduled_at
  FROM public.appointments a
  WHERE a.doctor_id = p_doctor_id
    AND a.status IN ('pending', 'confirmed')
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_booked_slots(UUID) TO anon, authenticated;
