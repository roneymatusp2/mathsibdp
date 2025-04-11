-- Schema para o banco de dados do IB MATHS CHOICE
-- Criação da tabela de questionários

CREATE TABLE public.questionarios (
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

-- Criação da tabela de questões

CREATE TABLE public.questoes (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    section TEXT NOT NULL,
    options JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criação da tabela de cursos

CREATE TABLE public.cursos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('HL', 'SL')),
    path TEXT NOT NULL CHECK (path IN ('AA', 'AI')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criação da tabela de escolas

CREATE TABLE public.escolas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT,
    country TEXT,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configurações de RLS (Row Level Security)

-- Ativar RLS em todas as tabelas
ALTER TABLE public.questionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escolas ENABLE ROW LEVEL SECURITY;

-- Criar políticas para leitura pública de questões e cursos
CREATE POLICY "Questões públicas de leitura" ON public.questoes
    FOR SELECT 
    USING (true);

CREATE POLICY "Cursos públicos de leitura" ON public.cursos
    FOR SELECT 
    USING (true);

CREATE POLICY "Escolas públicas de leitura" ON public.escolas
    FOR SELECT 
    USING (true);

-- Criar política para permitir inserção anônima de questionários
CREATE POLICY "Inserção anônima de questionários" ON public.questionarios
    FOR INSERT 
    WITH CHECK (true);

-- Criar política para restringir a leitura de questionários a administradores
CREATE POLICY "Leitura de questionários para admins" ON public.questionarios
    FOR SELECT 
    USING (auth.role() = 'authenticated' AND auth.uid() IN (
        SELECT user_id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    ));

-- Inserir dados iniciais

-- Cursos
INSERT INTO public.cursos (id, name, description, level, path) VALUES
('aa_hl', 'Analysis and Approaches HL', 'For students interested in mathematics, engineering, physical sciences, and some economics.', 'HL', 'AA'),
('aa_sl', 'Analysis and Approaches SL', 'For students interested in mathematics containing pure mathematical concepts requiring strong algebra skills.', 'SL', 'AA'),
('ai_hl', 'Applications and Interpretation HL', 'For students interested in social sciences, natural sciences, statistics, business, engineering, and technology.', 'HL', 'AI'),
('ai_sl', 'Applications and Interpretation SL', 'For students interested in describing our world and solving practical problems using mathematics.', 'SL', 'AI');

-- Questões de exemplo
INSERT INTO public.questoes (id, text, section, options) VALUES
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
]');

-- Escolas de exemplo
INSERT INTO public.escolas (name, domain, country, city) VALUES
('St. Paul''s School', 'stpauls.br', 'Brazil', 'São Paulo'),
('British College', 'britishcollege.br', 'Brazil', 'São Paulo'),
('American School', 'americanschool.br', 'Brazil', 'Rio de Janeiro'),
('St. Francis College', 'stfrancis.br', 'Brazil', 'São Paulo'),
('Escola Suíço-Brasileira', 'escolasuica.br', 'Brazil', 'São Paulo');

-- Índices para melhorar performance

CREATE INDEX idx_questionarios_timestamp ON public.questionarios (timestamp DESC);
CREATE INDEX idx_questionarios_recommended_course ON public.questionarios (recommended_course);
CREATE INDEX idx_questionarios_email_domain ON public.questionarios ((split_part(email, '@', 2)));
CREATE INDEX idx_questoes_section ON public.questoes (section);
