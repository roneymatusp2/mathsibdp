-- Script para criar as tabelas de escolas e usuários do projeto IB MATHS CHOICE
-- Execute este script diretamente no Editor SQL do Supabase

-- Ativar a extensão uuid-ossp se ainda não estiver ativada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de escolas
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#4f46e5',
  secondary_color TEXT DEFAULT '#3b82f6',
  admin_name TEXT,
  admin_email TEXT,
  teacher_password TEXT,
  student_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar a coluna school_id à tabela questionarios, se ela não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'questionarios' 
                 AND column_name = 'school_id') THEN
    ALTER TABLE public.questionarios ADD COLUMN school_id UUID REFERENCES schools(id);
  END IF;
END $$;

-- Configurações de RLS (Row Level Security)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas para escolas
CREATE POLICY "Schools can be viewed by anyone" 
ON public.schools FOR SELECT 
USING (true);

CREATE POLICY "Schools can only be created by admins" 
ON public.schools FOR INSERT 
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Schools can only be updated by admins" 
ON public.schools FOR UPDATE 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para usuários
CREATE POLICY "Users can be viewed by school admins and teachers" 
ON public.users FOR SELECT 
TO authenticated
USING (
  auth.jwt() ->> 'role' IN ('admin') OR 
  (auth.jwt() ->> 'role' = 'teacher' AND school_id::text = auth.jwt() ->> 'school_id')
);

CREATE POLICY "Users can only be created by school admins and teachers" 
ON public.users FOR INSERT 
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'role' = 'teacher' AND school_id::text = auth.jwt() ->> 'school_id')
);

CREATE POLICY "Users can only be updated by school admins and teachers" 
ON public.users FOR UPDATE 
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'role' = 'teacher' AND school_id::text = auth.jwt() ->> 'school_id')
);

-- Políticas para questionários
CREATE POLICY "Questionários can only be viewed by school admins and teachers" 
ON public.questionarios FOR SELECT 
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'role' = 'teacher' AND school_id::text = auth.jwt() ->> 'school_id')
);

-- Política para que alunos vejam apenas seus próprios questionários
CREATE POLICY "Students can only view their own questionários" 
ON public.questionarios FOR SELECT 
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'student' AND 
  school_id::text = auth.jwt() ->> 'school_id' AND
  student_id::text = auth.jwt() ->> 'sub'
);

-- Students can insert their own questionnaires
CREATE POLICY "Students can insert their own questionários" 
ON public.questionarios FOR INSERT 
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'student' AND 
  school_id::text = auth.jwt() ->> 'school_id' AND
  student_id::text = auth.jwt() ->> 'sub'
);

-- Inserir 10 escolas com suas credenciais
INSERT INTO public.schools (name, code, password, primary_color, secondary_color)
VALUES
  ('St. Paul''s School', 'STPAULS', 'IB2025@sp', '#3b5998', '#8b9dc3'),
  ('British College', 'BRITCOL', 'IB2025@bc', '#b80f0a', '#f5deb3'),
  ('American School', 'AMSCHOOL', 'IB2025@as', '#00205b', '#d22630'),
  ('St. Francis College', 'STFRAN', 'IB2025@sf', '#006400', '#8fbc8f'),
  ('Escola Suíço-Brasileira', 'SUICO', 'IB2025@es', '#ff0000', '#ffffff'),
  ('International School', 'INTSCH', 'IB2025@is', '#4b0082', '#e6e6fa'),
  ('Canadian International School', 'CANINT', 'IB2025@ci', '#ff0000', '#ffffff'),
  ('French International School', 'FRENCH', 'IB2025@fi', '#002395', '#ffffff'),
  ('German International School', 'GERMAN', 'IB2025@gi', '#000000', '#dd0000'),
  ('Japanese International School', 'JAPAN', 'IB2025@ji', '#bc002d', '#ffffff')
ON CONFLICT (code) DO NOTHING;

-- Criar um admin para cada escola
INSERT INTO public.users (school_id, name, email, username, password, role)
SELECT 
  id, 
  name || ' Admin', 
  'admin@' || lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g')) || '.edu', 
  'admin', 
  'admin2025', 
  'admin'
FROM public.schools
ON CONFLICT DO NOTHING;

-- Criar alguns professores e alunos de exemplo
DO $$ 
DECLARE
  school_id_var UUID;
BEGIN
  FOR school_id_var IN SELECT id FROM public.schools LOOP
    -- Adicionar professores
    INSERT INTO public.users (school_id, name, email, username, password, role)
    VALUES
      (school_id_var, 'Math Teacher', 'math@example.com', 'mathteacher', 'teacher2025', 'teacher'),
      (school_id_var, 'Science Teacher', 'science@example.com', 'scienceteacher', 'teacher2025', 'teacher')
    ON CONFLICT DO NOTHING;
    
    -- Adicionar alunos
    INSERT INTO public.users (school_id, name, email, username, password, role)
    VALUES
      (school_id_var, 'Student 1', 'student1@example.com', 'student1', 'student2025', 'student'),
      (school_id_var, 'Student 2', 'student2@example.com', 'student2', 'student2025', 'student'),
      (school_id_var, 'Student 3', 'student3@example.com', 'student3', 'student2025', 'student')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON public.users (school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_questionarios_school_id ON public.questionarios (school_id);
