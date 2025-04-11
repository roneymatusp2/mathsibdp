-- Script para criar as tabelas do projeto IB MATHS CHOICE
-- Execute este script diretamente no Editor SQL do Supabase

-- Ativar a extensão uuid-ossp se ainda não estiver ativada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de questionários
CREATE TABLE IF NOT EXISTS public.questionarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    recommended_course TEXT NOT NULL,
    confidence_score INTEGER NOT NULL,
    answers JSONB NOT NULL,
    school TEXT,
    gender TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de questões
CREATE TABLE IF NOT EXISTS public.questoes (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    section TEXT NOT NULL,
    options JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS public.cursos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('HL', 'SL')),
    path TEXT NOT NULL CHECK (path IN ('AA', 'AI')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de escolas
CREATE TABLE IF NOT EXISTS public.escolas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT,
    country TEXT,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configurações de RLS (Row Level Security)
ALTER TABLE public.questionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escolas ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública de questões e cursos
CREATE POLICY IF NOT EXISTS "Questões públicas de leitura" 
ON public.questoes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Cursos públicos de leitura" 
ON public.cursos FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Escolas públicas de leitura" 
ON public.escolas FOR SELECT USING (true);

-- Política para permitir inserção anônima de questionários
CREATE POLICY IF NOT EXISTS "Inserção anônima de questionários" 
ON public.questionarios FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de questionários aos administradores
CREATE POLICY IF NOT EXISTS "Leitura de questionários para admins" 
ON public.questionarios FOR SELECT USING (
    auth.role() = 'authenticated' OR auth.role() = 'service_role'
);

-- Inserir dados iniciais de cursos
INSERT INTO public.cursos (id, name, description, level, path)
VALUES
    ('aa_hl', 'Analysis and Approaches HL', 'For students interested in mathematics, engineering, physical sciences, and some economics.', 'HL', 'AA'),
    ('aa_sl', 'Analysis and Approaches SL', 'For students interested in mathematics containing pure mathematical concepts requiring strong algebra skills.', 'SL', 'AA'),
    ('ai_hl', 'Applications and Interpretation HL', 'For students interested in social sciences, natural sciences, statistics, business, engineering, and technology.', 'HL', 'AI'),
    ('ai_sl', 'Applications and Interpretation SL', 'For students interested in describing our world and solving practical problems using mathematics.', 'SL', 'AI')
ON CONFLICT (id) DO NOTHING;

-- Inserir questões de exemplo
INSERT INTO public.questoes (id, text, section, options)
VALUES
    ('career_field1', 'Which career field are you most interested in?', 'interests', '[
        {"value": "aa_hl", "label": "Pure sciences (physics, chemistry)"},
        {"value": "aa_sl", "label": "Medicine or biology"},
        {"value": "ai_hl", "label": "Engineering or computer science"},
        {"value": "ai_sl", "label": "Business, economics, or social sciences"}
    ]'),
    ('skill1', 'Which mathematical skill do you feel most confident in?', 'abilities', '[
        {"value": "aa_hl", "label": "Working with abstract concepts and proofs"},
        {"value": "aa_sl", "label": "Solving algebra problems"},
        {"value": "ai_hl", "label": "Using mathematics to model real-world situations"},
        {"value": "ai_sl", "label": "Interpreting data and statistics"}
    ]'),
    ('learning1', 'How do you prefer to learn mathematics?', 'preferences', '[
        {"value": "aa_hl", "label": "Through rigorous proofs and theory"},
        {"value": "aa_sl", "label": "Through examples with clear steps to follow"},
        {"value": "ai_hl", "label": "Through real-world applications and projects"},
        {"value": "ai_sl", "label": "Through practical exercises with technology"}
    ]')
ON CONFLICT (id) DO NOTHING;

-- Inserir escolas de exemplo
INSERT INTO public.escolas (name, domain, country, city)
VALUES
    ('St. Paul''s School', 'stpauls.br', 'Brazil', 'São Paulo'),
    ('British College', 'britishcollege.br', 'Brazil', 'São Paulo'),
    ('American School', 'americanschool.br', 'Brazil', 'Rio de Janeiro'),
    ('St. Francis College', 'stfrancis.br', 'Brazil', 'São Paulo'),
    ('Escola Suíço-Brasileira', 'escolasuica.br', 'Brazil', 'São Paulo')
ON CONFLICT DO NOTHING;

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_questionarios_timestamp ON public.questionarios (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_questionarios_recommended_course ON public.questionarios (recommended_course);
CREATE INDEX IF NOT EXISTS idx_questionarios_email_domain ON public.questionarios ((split_part(email, '@', 2)));
CREATE INDEX IF NOT EXISTS idx_questoes_section ON public.questoes (section);