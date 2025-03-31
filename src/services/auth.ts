// Simulação de autenticação - em produção, isso seria integrado com um backend
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher';
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