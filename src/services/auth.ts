// Serviço de autenticação para admin e alunos
import { supabase } from './supabase';
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  email?: string;
  school?: string;
}

// Registro de estudante
export interface StudentRegistration {
  name: string;
  email: string;
  school?: string;
  password?: string;
  sendResults: boolean;
}

// Credenciais fixas para demonstração
const VALID_CREDENTIALS = [
  { username: 'admin', password: 'ibmaths2025', user: { id: '1', username: 'admin', name: 'Administrator', role: 'admin' } },
  { username: 'teacher', password: 'stpauls', user: { id: '2', username: 'teacher', name: 'Teacher Account', role: 'teacher' } },
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
    // Em uma implementação real, isso criaria um usuário no Supabase Auth
    // e armazenaria as preferências do usuário
    
    // Simulação para propósitos de demonstração
    const newUser: User = {
      id: `student_${Date.now()}`,
      username: registration.email.split('@')[0],
      name: registration.name,
      role: 'student',
      email: registration.email,
      school: registration.school
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