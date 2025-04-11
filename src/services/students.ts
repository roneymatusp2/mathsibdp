import { addQuestionario, getAllQuestionarios, getQuestionarioById, exportQuestionariosToCSV } from './supabase';

// Tipos
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  timestamp: string;
  recommendedCourse: string;
  confidenceScore: number;
  answers: Record<string, string[]>;
}

// FALLBACK in case Supabase is not available
const STORAGE_KEY = 'ibmaths_student_records';

// Sample data for initialization
const sampleStudents: StudentRecord[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@stpauls.school',
    timestamp: '2025-03-25T14:32:00Z',
    recommendedCourse: 'AA HL',
    confidenceScore: 87,
    answers: { career_field1: ['aa_hl'], skill1: ['aa_hl'] }
  },
  {
    id: '2',
    name: 'Bruno Santos',
    email: 'bruno.s@stpauls.school',
    timestamp: '2025-03-25T15:45:00Z',
    recommendedCourse: 'AI SL',
    confidenceScore: 92,
    answers: { career_field1: ['ai_sl'], skill1: ['ai_sl'] }
  },
  {
    id: '3',
    name: 'Carla Martinez',
    email: 'carla.m@stpauls.school',
    timestamp: '2025-03-26T10:15:00Z',
    recommendedCourse: 'AI HL',
    confidenceScore: 78,
    answers: { career_field1: ['ai_hl'], skill1: ['ai_hl'] }
  },
  {
    id: '4',
    name: 'Daniel Oliveira',
    email: 'daniel.o@stpauls.school',
    timestamp: '2025-03-26T11:20:00Z',
    recommendedCourse: 'AA SL',
    confidenceScore: 81,
    answers: { career_field1: ['aa_sl'], skill1: ['aa_sl'] }
  },
  {
    id: '5',
    name: 'Eduarda Costa',
    email: 'eduarda.c@stpauls.school',
    timestamp: '2025-03-26T13:05:00Z',
    recommendedCourse: 'AA HL',
    confidenceScore: 94,
    answers: { career_field1: ['aa_hl'], skill1: ['aa_hl'] }
  }
];

// Local fallback initialization
const initStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleStudents));
  }
};

// Get all records
export const getAllStudentRecords = async (): Promise<StudentRecord[]> => {
  try {
    // Try to fetch from Supabase first
    const records = await getAllQuestionarios();
    if (records && records.length > 0) {
      return records.map(record => ({
        id: record.id,
        name: record.name,
        email: record.email,
        timestamp: record.timestamp,
        recommendedCourse: record.recommended_course,
        confidenceScore: record.confidence_score,
        answers: record.answers
      }));
    }
  } catch (error) {
    console.error('Error fetching records from Supabase, using local fallback:', error);
  }
  
  // Fallback to localStorage
  initStorage();
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
};

// Get record by ID
export const getStudentRecordById = async (id: string): Promise<StudentRecord | null> => {
  try {
    // Try to fetch from Supabase first
    const record = await getQuestionarioById(id);
    if (record) {
      return {
        id: record.id,
        name: record.name,
        email: record.email,
        timestamp: record.timestamp,
        recommendedCourse: record.recommended_course,
        confidenceScore: record.confidence_score,
        answers: record.answers
      };
    }
  } catch (error) {
    console.error(`Error fetching record ${id} from Supabase, using local fallback:`, error);
  }
  
  // Fallback to localStorage
  const records = await getAllStudentRecords();
  return records.find(record => record.id === id) || null;
};

// Add new record
export const addStudentRecord = async (
  studentName: string, 
  studentEmail: string, 
  recommendedCourse: string, 
  confidenceScore: number,
  answers: Record<string, string[]>
): Promise<StudentRecord> => {
  try {
    // Try to add to Supabase first
    const record = await addQuestionario(
      studentName,
      studentEmail,
      recommendedCourse,
      confidenceScore,
      answers
    );
    
    if (record) {
      return {
        id: record.id,
        name: record.name,
        email: record.email,
        timestamp: record.timestamp,
        recommendedCourse: record.recommended_course,
        confidenceScore: record.confidence_score,
        answers: record.answers
      };
    }
  } catch (error) {
    console.error('Error adding record to Supabase, using local fallback:', error);
  }
  
  // Fallback to localStorage
  const records = await getAllStudentRecords();
  
  const newRecord: StudentRecord = {
    id: Date.now().toString(),
    name: studentName,
    email: studentEmail,
    timestamp: new Date().toISOString(),
    recommendedCourse,
    confidenceScore,
    answers
  };
  
  const updatedRecords = [...records, newRecord];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  
  return newRecord;
};

// Export to CSV
export const exportStudentsToCSV = async (records?: StudentRecord[]): Promise<string> => {
  try {
    // Try to export from Supabase first
    const csv = await exportQuestionariosToCSV();
    if (csv) {
      return csv;
    }
  } catch (error) {
    console.error('Error exporting records from Supabase, using local fallback:', error);
  }
  
  // Fallback to localStorage
  if (!records) {
    records = await getAllStudentRecords();
  }
  
  // Headers
  const headers = ['ID', 'Name', 'Email', 'Date', 'Recommended Course', 'Confidence Score'];
  
  // Convert data to CSV format
  const csvRows = [
    headers.join(','),
    ...records.map(student => {
      return [
        student.id,
        `"${student.name}"`,
        student.email,
        new Date(student.timestamp).toLocaleDateString(),
        student.recommendedCourse,
        student.confidenceScore
      ].join(',');
    })
  ];
  
  return csvRows.join('\n');
};