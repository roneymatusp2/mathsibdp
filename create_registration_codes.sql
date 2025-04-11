-- Create registration codes table
CREATE TABLE IF NOT EXISTS public.registration_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can view and create registration codes
CREATE POLICY "Admins can view registration codes"
ON public.registration_codes FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can create registration codes"
ON public.registration_codes FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert 10 registration codes (these are for new schools)
INSERT INTO public.registration_codes (code, expires_at)
VALUES
  ('REG-MATH-94872', NOW() + INTERVAL '30 days'),
  ('REG-MATH-38751', NOW() + INTERVAL '30 days'),
  ('REG-MATH-29463', NOW() + INTERVAL '30 days'),
  ('REG-MATH-57390', NOW() + INTERVAL '30 days'),
  ('REG-MATH-16284', NOW() + INTERVAL '30 days'),
  ('REG-MATH-72951', NOW() + INTERVAL '30 days'),
  ('REG-MATH-83621', NOW() + INTERVAL '30 days'),
  ('REG-MATH-46018', NOW() + INTERVAL '30 days'),
  ('REG-MATH-59273', NOW() + INTERVAL '30 days'),
  ('REG-MATH-31748', NOW() + INTERVAL '30 days');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registration_codes_used ON public.registration_codes (used);
CREATE INDEX IF NOT EXISTS idx_registration_codes_code ON public.registration_codes (code);
