// Serviço de autenticação para admin e alunos
import { supabase } from './supabase';
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  email?: string;
  registrationCode?: string;
}

// Registro de estudante
export interface StudentRegistration {
  name: string;
  email: string;
  registrationCode: string;
  password?: string;
  sendResults: boolean;
}

// Credenciais fixas para demonstração
const VALID_CREDENTIALS = [
  { username: 'admin', password: 'ibmaths2025', user: { id: '1', username: 'admin', name: 'Administrator', role: 'admin' } },
  { username: 'teacher', password: 'stpauls', user: { id: '2', username: 'teacher', name: 'Teacher Account', role: 'teacher' } },
];

// Códigos de registro válidos para demonstração
const VALID_REGISTRATION_CODES = [
  'REG-MATH-94872',
  'REG-MATH-38751',
  'REG-MATH-29463',
  'REG-MATH-57390',
  'REG-MATH-16284',
  'REG-MATH-72951',
  'REG-MATH-83621',
  'REG-MATH-46018',
  'REG-MATH-59273',
  'REG-MATH-31748'
];

export const login = async (username: string, password: string): Promise<User | null> => {
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const match = VALID_CREDENTIALS.find(
    cred => cred.username === username && cred.password === password
  );
  
  if (match) {
    // Salvar no localStorage (em produção, usaríamos JWT tokens)
    localStorage.setItem('auth_user', JSON.stringify(match.user));
    return match.user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('auth_user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};

// Simulação de verificação de token (em produção, verificaria JWT)
export const checkAuth = (): boolean => {
  return !!getCurrentUser();
};

// Registrar um novo estudante
export const registerStudent = async (registration: StudentRegistration): Promise<User | null> => {
  try {
    // Verificar se o código de registro é válido
    const isCodeValid = VALID_REGISTRATION_CODES.includes(registration.registrationCode.trim().toUpperCase());
    
    if (!isCodeValid) {
      console.error('Invalid registration code:', registration.registrationCode);
      return null;
    }
    
    // Em uma implementação real, isso criaria um usuário no Supabase Auth
    // e armazenaria as preferências do usuário
    
    // Simulação para propósitos de demonstração
    const newUser: User = {
      id: `student_${Date.now()}`,
      username: registration.email.split('@')[0],
      name: registration.name,
      role: 'student',
      email: registration.email,
      registrationCode: registration.registrationCode
    };
    
    // Armazenar preferência para receber resultados por email
    localStorage.setItem(`student_email_pref_${newUser.id}`, registration.sendResults.toString());
    
    // Em produção, isso enviaria um email de confirmação
    if (registration.sendResults) {
      console.log(`Enviando email de confirmação para ${registration.email}`);
      // Simular envio de email com resultados
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return newUser;
  } catch (error) {
    console.error('Error registering student:', error);
    return null;
  }
};

// Verificar se um estudante deseja receber resultados por email
export const getStudentEmailPreference = (userId: string): boolean => {
  const pref = localStorage.getItem(`student_email_pref_${userId}`);
  return pref === 'true';
};

// Atualizar preferência de email do estudante
export const updateStudentEmailPreference = (userId: string, sendResults: boolean): void => {
  localStorage.setItem(`student_email_pref_${userId}`, sendResults.toString());
};