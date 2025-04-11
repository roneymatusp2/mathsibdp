// Definition of Supabase schema for multi-school authentication system

/**
 * # Schools Table Structure
 * 
 * CREATE TABLE schools (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   code TEXT NOT NULL UNIQUE,
 *   password TEXT NOT NULL,
 *   logo_url TEXT,
 *   primary_color TEXT DEFAULT '#003087',
 *   secondary_color TEXT DEFAULT '#E71D36',
 *   teacher_password TEXT NOT NULL,
 *   student_password TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * # Users Table Structure
 * 
 * CREATE TABLE users (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   email TEXT,
 *   school_id UUID REFERENCES schools(id),
 *   role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * # Insert initial admin user
 * 
 * INSERT INTO users (name, email, role) 
 * VALUES ('Super Admin', 'admin@ibmaths.choice', 'admin');
 * 
 * # Modify questionarios table to link to schools and users
 * 
 * ALTER TABLE questionarios 
 * ADD COLUMN school_id UUID REFERENCES schools(id),
 * ADD COLUMN user_id UUID REFERENCES users(id);
 * 
 * # Row Level Security Policies
 * 
 * -- Enable RLS on all tables
 * ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE users ENABLE ROW LEVEL SECURITY;
 * 
 * -- Admin can see and manage all schools and users
 * CREATE POLICY "Admin has full access to schools" ON schools
 *   USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
 * 
 * CREATE POLICY "Admin has full access to users" ON users
 *   USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
 * 
 * -- Teachers can only see their own school's data
 * CREATE POLICY "Teachers can only view their school" ON schools
 *   FOR SELECT USING (EXISTS (
 *     SELECT 1 FROM users 
 *     WHERE users.id = auth.uid() 
 *     AND users.role = 'teacher'
 *     AND users.school_id = schools.id
 *   ));
 * 
 * CREATE POLICY "Teachers can only view users from their school" ON users
 *   FOR SELECT USING (
 *     (users.school_id IN (
 *       SELECT school_id FROM users WHERE users.id = auth.uid() AND users.role = 'teacher'
 *     ))
 *   );
 * 
 * -- Modify questionarios policies
 * CREATE POLICY "Users can only view their school's questionnaires" ON questionarios
 *   FOR SELECT USING (
 *     (questionarios.school_id IN (
 *       SELECT school_id FROM users WHERE users.id = auth.uid()
 *     ))
 *     OR
 *     (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
 *   );
 */

// Types for Supabase tables
export type School = {
  id: string;
  name: string;
  code: string;
  password?: string; // Only used during authentication, not stored client-side
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  teacher_password?: string; // Only used during authentication, not stored client-side
  student_password?: string; // Only used during authentication, not stored client-side
  created_at: string;
};

export type UserRole = 'admin' | 'teacher' | 'student';

export type User = {
  id: string;
  name: string;
  email?: string;
  school_id?: string;
  role: UserRole;
  created_at: string;
};

// Enhanced types for existing tables with school relationships
export type ExtendedTables = {
  schools: School;
  users: User;
  questionarios: {
    id: string;
    name: string;
    email: string;
    timestamp: string;
    recommended_course: string;
    confidence_score: number;
    answers: Record<string, string[]>;
    school_id: string;
    user_id: string;
  };
};
