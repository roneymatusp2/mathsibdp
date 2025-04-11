import { supabase } from './supabase';

// Types
export type SchoolRole = 'admin' | 'teacher' | 'student';

export interface School {
  id: string;
  name: string;
  code: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface SchoolUser {
  id: string;
  name: string;
  email?: string;
  school_id: string;
  role: SchoolRole;
}

// Get school by code
export const getSchoolByCode = async (code: string): Promise<School | null> => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    console.error('Error fetching school:', error);
    return null;
  }

  return data;
};

// School authentication
export const authenticateSchool = async (code: string, password: string): Promise<School | null> => {
  // Get school by code
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('code', code)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error('School authentication failed:', error);
    return null;
  }

  // Store school in local storage
  localStorage.setItem('current_school', JSON.stringify(data));
  return data;
};

// User authentication within a school
export const authenticateUser = async (
  schoolId: string,
  username: string,
  password: string,
  role: SchoolRole
): Promise<SchoolUser | null> => {
  // Get user by school_id, username, password and role
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('school_id', schoolId)
    .eq('username', username)
    .eq('password', password)
    .eq('role', role)
    .single();

  if (error || !data) {
    console.error('User authentication failed:', error);
    return null;
  }

  // Store user in local storage
  localStorage.setItem('current_user', JSON.stringify(data));
  return data;
};

// Get current school from local storage
export const getCurrentSchool = (): School | null => {
  const school = localStorage.getItem('current_school');
  return school ? JSON.parse(school) : null;
};

// Get current user from local storage
export const getCurrentUser = (): SchoolUser | null => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};

// Logout school
export const logoutSchool = (): void => {
  localStorage.removeItem('current_school');
  localStorage.removeItem('current_user');
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('current_user');
};

// Get all schools (admin only)
export const getAllSchools = async (): Promise<School[]> => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching schools:', error);
    return [];
  }

  return data || [];
};

// Create a new account for a student
export const createStudentAccount = async (
  schoolId: string,
  name: string,
  username: string,
  password: string
): Promise<SchoolUser | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        school_id: schoolId,
        name: name,
        username: username,
        password: password,
        role: 'student'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating student account:', error);
    return null;
  }

  return data;
};

// Get students by school ID
export const getStudentsBySchool = async (schoolId: string): Promise<SchoolUser[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('school_id', schoolId)
    .eq('role', 'student')
    .order('name');

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  return data || [];
};
