import { createClient } from '@supabase/supabase-js';

// URLs and keys should be defined as environment variables in production
// For this project, we're defining them directly here
// Supabase credentials come from environment variables
// URL and key for project azhtkpetziwxgkgmkmkb
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://azhtkpetziwxgkgmkmkb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTE3NjUsImV4cCI6MjA1OTgyNzc2NX0.5iek9Sn7LLc7L5V-z7WjmSjE5osxK2uQGDEfUOUXOAk';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export const getQuestionarioById = async (id) => {
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
  studentName,
  studentEmail,
  recommendedCourse,
  confidenceScore,
  answers
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
