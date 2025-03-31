// Tipos
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  timestamp: string;
  recommendedCourse: string;
  confidenceScore: number;
  answers: Record<string, string>;
}

// Simulação de banco de dados em memória/localStorage
const STORAGE_KEY = 'ibmaths_student_records';

// Dados de exemplo para inicialização
const sampleStudents: StudentRecord[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@stpauls.school',
    timestamp: '2025-03-25T14:32:00Z',
    recommendedCourse: 'AA HL',
    confidenceScore: 87,
    answers: { career_field1: 'aa_hl', skill1: 'aa_hl' }
  },
  {
    id: '2',
    name: 'Bruno Santos',
    email: 'bruno.s@stpauls.school',
    timestamp: '2025-03-25T15:45:00Z',
    recommendedCourse: 'AI SL',
    confidenceScore: 92,
    answers: { career_field1: 'ai_sl', skill1: 'ai_sl' }
  },
  {
    id: '3',
    name: 'Carla Martinez',
    email: 'carla.m@stpauls.school',
    timestamp: '2025-03-26T10:15:00Z',
    recommendedCourse: 'AI HL',
    confidenceScore: 78,
    answers: { career_field1: 'ai_hl', skill1: 'ai_hl' }
  },
  {
    id: '4',
    name: 'Daniel Oliveira',
    email: 'daniel.o@stpauls.school',
    timestamp: '2025-03-26T11:20:00Z',
    recommendedCourse: 'AA SL',
    confidenceScore: 81,
    answers: { career_field1: 'aa_sl', skill1: 'aa_sl' }
  },
  {
    id: '5',
    name: 'Eduarda Costa',
    email: 'eduarda.c@stpauls.school',
    timestamp: '2025-03-26T13:05:00Z',
    recommendedCourse: 'AA HL',
    confidenceScore: 94,
    answers: { career_field1: 'aa_hl', skill1: 'aa_hl' }
  }
];

// Inicialização
const initStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleStudents));
  }
};

// Obter todos os registros
export const getAllStudentRecords = (): StudentRecord[] => {
  initStorage();
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
};

// Obter registro por ID
export const getStudentRecordById = (id: string): StudentRecord | null => {
  const records = getAllStudentRecords();
  return records.find(record => record.id === id) || null;
};

// Adicionar novo registro
export const addStudentRecord = (
  studentName: string, 
  studentEmail: string, 
  recommendedCourse: string, 
  confidenceScore: number,
  answers: Record<string, string>
): StudentRecord => {
  const records = getAllStudentRecords();
  
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

// Exportar para CSV
export const exportStudentsToCSV = (records: StudentRecord[] = getAllStudentRecords()): string => {
  // Cabeçalhos
  const headers = ['ID', 'Name', 'Email', 'Date', 'Recommended Course', 'Confidence Score'];
  
  // Converter dados para formato CSV
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