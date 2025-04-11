import { supabase } from './supabase';
import { School, User, UserRole } from './supabase-schema';

// Special tokens to simulate session management without actual JWT auth
const SCHOOL_TOKEN_KEY = 'ibmaths_school_token';
const USER_TOKEN_KEY = 'ibmaths_user_token';

export interface SchoolSession {
  school: School;
  timestamp: number;
}

export interface UserSession {
  user: User;
  timestamp: number;
}

// School Authentication Functions
export const authenticateSchool = async (code: string, password: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('code', code.toLowerCase())
      .single();
    
    if (error || !data) {
      console.error('Error finding school:', error);
      return null;
    }
    
    // In production, you would use proper password hashing
    // This is a simplified version for demonstration
    if (data.password === password) {
      // Remove sensitive data before storing in client
      const { password, teacher_password, student_password, ...safeSchoolData } = data;
      
      // Store school session
      const session: SchoolSession = {
        school: safeSchoolData,
        timestamp: Date.now()
      };
      localStorage.setItem(SCHOOL_TOKEN_KEY, JSON.stringify(session));
      
      return safeSchoolData;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const authenticateUser = async (
  schoolId: string, 
  name: string, 
  password: string, 
  role: 'teacher' | 'student'
): Promise<User | null> => {
  try {
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select(role === 'teacher' ? 'teacher_password' : 'student_password')
      .eq('id', schoolId)
      .single();
    
    if (schoolError || !schoolData) {
      console.error('Error finding school credentials:', schoolError);
      return null;
    }
    
    // Check if the password matches the role-specific password
    const correctPassword = role === 'teacher' 
      ? schoolData.teacher_password 
      : schoolData.student_password;
    
    if (password !== correctPassword) {
      return null;
    }
    
    // Check if user already exists
    const { data: existingUser, error: userQueryError } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .eq('school_id', schoolId)
      .eq('role', role)
      .maybeSingle();
    
    if (userQueryError) {
      console.error('Error checking for existing user:', userQueryError);
    }
    
    let user: User;
    
    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          { 
            name, 
            school_id: schoolId, 
            role,
            // Generate email based on school and name
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@${role}.ibmaths.school`
          }
        ])
        .select()
        .single();
      
      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return null;
      }
      
      user = newUser;
    }
    
    // Store user session
    const session: UserSession = {
      user,
      timestamp: Date.now()
    };
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(session));
    
    return user;
  } catch (error) {
    console.error('User authentication error:', error);
    return null;
  }
};

export const authenticateAdmin = async (username: string, password: string): Promise<User | null> => {
  // This is a simplified version
  if (username === 'admin' && password === 'ibmaths2025') {
    // Get admin user from database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .maybeSingle();
    
    if (error || !data) {
      // Create admin user if it doesn't exist
      const { data: newAdmin, error: createError } = await supabase
        .from('users')
        .insert([
          { 
            name: 'Admin',
            role: 'admin',
            email: 'admin@ibmaths.choice'
          }
        ])
        .select()
        .single();
      
      if (createError || !newAdmin) {
        console.error('Error creating admin user:', createError);
        return null;
      }
      
      // Store user session
      const session: UserSession = {
        user: newAdmin,
        timestamp: Date.now()
      };
      localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(session));
      
      return newAdmin;
    }
    
    // Store user session
    const session: UserSession = {
      user: data,
      timestamp: Date.now()
    };
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(session));
    
    return data;
  }
  
  return null;
};

export const getCurrentSchool = (): School | null => {
  const sessionStr = localStorage.getItem(SCHOOL_TOKEN_KEY);
  if (!sessionStr) return null;
  
  try {
    const session: SchoolSession = JSON.parse(sessionStr);
    
    // Check if session is expired (24 hours)
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SCHOOL_TOKEN_KEY);
      return null;
    }
    
    return session.school;
  } catch (error) {
    localStorage.removeItem(SCHOOL_TOKEN_KEY);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const sessionStr = localStorage.getItem(USER_TOKEN_KEY);
  if (!sessionStr) return null;
  
  try {
    const session: UserSession = JSON.parse(sessionStr);
    
    // Check if session is expired (8 hours)
    if (Date.now() - session.timestamp > 8 * 60 * 60 * 1000) {
      localStorage.removeItem(USER_TOKEN_KEY);
      return null;
    }
    
    return session.user;
  } catch (error) {
    localStorage.removeItem(USER_TOKEN_KEY);
    return null;
  }
};

export const logoutSchool = (): void => {
  localStorage.removeItem(SCHOOL_TOKEN_KEY);
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_TOKEN_KEY);
};

export const logoutAll = (): void => {
  localStorage.removeItem(SCHOOL_TOKEN_KEY);
  localStorage.removeItem(USER_TOKEN_KEY);
};

// Check if user is an admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Check if user is a teacher
export const isTeacher = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'teacher';
};

// Check if user has access to admin panel (admin or teacher)
export const hasAdminAccess = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'teacher';
};
