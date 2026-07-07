-- Per-doctor procedure pricing & duration.
-- Each doctor can charge a different price and take a different amount of
-- time for the "same" procedure (e.g. a cardiologist consultation is longer
-- and more expensive than a general practice one).

ALTER TABLE doctor_procedures
  ADD COLUMN IF NOT EXISTS price_kzt INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 30;

ALTER TABLE doctor_procedures
  ADD CONSTRAINT doctor_procedures_price_kzt_check CHECK (price_kzt >= 0),
  ADD CONSTRAINT doctor_procedures_duration_check CHECK (duration_minutes > 0);

-- Backfill realistic per-doctor pricing/duration for the seeded demo data.
UPDATE doctor_procedures SET price_kzt = 8000, duration_minutes = 30
  WHERE doctor_id = 'a0000000-0000-4000-8000-000000000001' AND procedure_id = 'b0000000-0000-4000-8000-000000000001';
UPDATE doctor_procedures SET price_kzt = 5000, duration_minutes = 20
  WHERE doctor_id = 'a0000000-0000-4000-8000-000000000001' AND procedure_id = 'b0000000-0000-4000-8000-000000000002';
UPDATE doctor_procedures SET price_kzt = 12000, duration_minutes = 40
  WHERE doctor_id = 'a0000000-0000-4000-8000-000000000002' AND procedure_id = 'b0000000-0000-4000-8000-000000000001';
UPDATE doctor_procedures SET price_kzt = 15000, duration_minutes = 45
  WHERE doctor_id = 'a0000000-0000-4000-8000-000000000002' AND procedure_id = 'b0000000-0000-4000-8000-000000000003';
UPDATE doctor_procedures SET price_kzt = 10000, duration_minutes = 30
  WHERE doctor_id = 'a0000000-0000-4000-8000-000000000003' AND procedure_id = 'b0000000-0000-4000-8000-000000000001';
UPDATE doctor_procedures SET price_kzt = 13000, duration_minutes = 35
  WHERE doctor_id = 'a0000000-0000-4000-8000-000000000003' AND procedure_id = 'b0000000-0000-4000-8000-000000000004';
