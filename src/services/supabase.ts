import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, PostgrestError } from '@supabase/supabase-js';

// URLs and keys should be defined as environment variables in production
// For this project, we're defining them directly here
// Supabase credentials come from environment variables
// URL and key for project azhtkpetziwxgkgmkmkb
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://azhtkpetziwxgkgmkmkb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTE3NjUsImV4cCI6MjA1OTgyNzc2NX0.5iek9Sn7LLc7L5V-z7WjmSjE5osxK2uQGDEfUOUXOAk';

// Type for Supabase tables
export type Tables = {
  questionarios: {
    id: string;
    name: string;
    email: string;
    timestamp: string;
    recommended_course: string;
    confidence_score: number;
    answers: Record<string, string[]>;
  };
  questoes: {
    id: string;
    text: string;
    section: string;
    options: {
      value: string;
      label: string;
    }[];
  };
  cursos: {
    id: string;
    name: string;
    description: string;
    level: 'HL' | 'SL';
    path: 'AA' | 'AI';
  }
};

// Initialize the Supabase client
export const supabase = createClient<Tables>(supabaseUrl, supabaseAnonKey);

// Helper functions to interact with Supabase

export const getAllQuestionarios = async () => {
  const { data, error } = await supabase
    .from('questionarios')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching questionnaires:', error);
    return [];
  }

  return data || [];
};

export const getQuestionarioById = async (id: string) => {
  const { data, error } = await supabase
    .from('questionarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching questionnaire ${id}:`, error);
    return null;
  }

  return data;
};

export const addQuestionario = async (
  studentName: string,
  studentEmail: string,
  recommendedCourse: string,
  confidenceScore: number,
  answers: Record<string, string[]>
) => {
  // Normalize the email to ensure it belongs to St. Paul's School
  if (!studentEmail.includes('@')) {
    studentEmail = `${studentEmail.toLowerCase().replace(/\s+/g, '.')}@stpauls.school`;
  }

  const { data, error } = await supabase
    .from('questionarios')
    .insert([
      {
        name: studentName,
        email: studentEmail,
        timestamp: new Date().toISOString(),
        recommended_course: recommendedCourse,
        confidence_score: confidenceScore,
        answers: answers
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding questionnaire:', error);
    throw new Error(`Failed to save questionnaire: ${error.message}`);
  }

  return data;
};

export const exportQuestionariosToCSV = async () => {
  const questionarios = await getAllQuestionarios();
  
  // Headers
  const headers = ['ID', 'Name', 'Email', 'Date', 'Recommended Course', 'Confidence Score'];
  
  // Convert data to CSV format
  const csvRows = [
    headers.join(','),
    ...questionarios.map(student => {
      return [
        student.id,
        `"${student.name}"`,
        student.email,
        new Date(student.timestamp).toLocaleDateString(),
        student.recommended_course,
        student.confidence_score
      ].join(',');
    })
  ];
  
  return csvRows.join('\n');
};

// SQL Scripts to create tables in Supabase

/*
SQL to create questionnaires table:

CREATE TABLE questionarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  recommended_course TEXT NOT NULL,
  confidence_score INTEGER NOT NULL,
  answers JSONB NOT NULL
);

SQL to create questions table:

CREATE TABLE questoes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  section TEXT NOT NULL,
  options JSONB NOT NULL
);

SQL to create courses table:

CREATE TABLE cursos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('HL', 'SL')),
  path TEXT NOT NULL CHECK (path IN ('AA', 'AI'))
);

Recommended RLS (Row Level Security) permissions:

-- Enable RLS on all tables
ALTER TABLE questionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous read access only to questions and courses
CREATE POLICY "Anyone can read questions" ON questoes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read courses" ON cursos
  FOR SELECT USING (true);

-- Create policy to allow anonymous insertion of questionnaires
CREATE POLICY "Anyone can insert questionnaires" ON questionarios
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reading questionnaires only for authenticated users
CREATE POLICY "Only authenticated users can read questionnaires" ON questionarios
  FOR SELECT USING (auth.role() = 'authenticated');
*/
