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

// Pre-defined registration codes for schools
const REGISTRATION_CODES = [
  "REG-MATH-94872",
  "REG-MATH-38751",
  "REG-MATH-29463",
  "REG-MATH-57390",
  "REG-MATH-16284",
  "REG-MATH-72951",
  "REG-MATH-83621",
  "REG-MATH-46018",
  "REG-MATH-59273",
  "REG-MATH-31748"
];

// Pre-defined schools for testing - using registration codes instead of school names
const PREDEFINED_SCHOOLS: Record<string, { 
  id: string; 
  name: string; 
  code: string; 
  password: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}> = {
  "SCHOOL_A": {
    id: "school_001",
    name: "School A", // Generic name, will be set by the school during first login
    code: "REG-MATH-94872",
    password: "ibmaths2025",
    primary_color: "#3B82F6",
    secondary_color: "#6366F1"
  },
  "SCHOOL_B": {
    id: "school_002",
    name: "School B",
    code: "REG-MATH-38751",
    password: "ibmaths2025",
    primary_color: "#10B981",
    secondary_color: "#059669"
  },
  "SCHOOL_C": {
    id: "school_003",
    name: "School C",
    code: "REG-MATH-29463",
    password: "ibmaths2025",
    primary_color: "#EF4444",
    secondary_color: "#DC2626"
  },
  "SCHOOL_D": {
    id: "school_004",
    name: "School D",
    code: "REG-MATH-57390",
    password: "ibmaths2025",
    primary_color: "#8B5CF6",
    secondary_color: "#7C3AED"
  },
  "SCHOOL_E": {
    id: "school_005",
    name: "School E",
    code: "REG-MATH-16284",
    password: "ibmaths2025",
    primary_color: "#F59E0B",
    secondary_color: "#D97706"
  },
  "SCHOOL_F": {
    id: "school_006",
    name: "School F",
    code: "REG-MATH-72951",
    password: "ibmaths2025",
    primary_color: "#3B82F6",
    secondary_color: "#1D4ED8"
  },
  "SCHOOL_G": {
    id: "school_007",
    name: "School G",
    code: "REG-MATH-83621",
    password: "ibmaths2025",
    primary_color: "#EC4899",
    secondary_color: "#BE185D"
  },
  "SCHOOL_H": {
    id: "school_008",
    name: "School H",
    code: "REG-MATH-46018",
    password: "ibmaths2025",
    primary_color: "#14B8A6",
    secondary_color: "#0F766E"
  },
  "SCHOOL_I": {
    id: "school_009",
    name: "School I",
    code: "REG-MATH-59273",
    password: "ibmaths2025",
    primary_color: "#6366F1",
    secondary_color: "#4338CA"
  },
  "SCHOOL_J": {
    id: "school_010",
    name: "School J",
    code: "REG-MATH-31748",
    password: "ibmaths2025",
    primary_color: "#F97316",
    secondary_color: "#C2410C"
  }
};

// Pre-defined users for testing
const PREDEFINED_USERS: {
  id: string;
  school_id: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  role: SchoolRole;
}[] = [
  // Admin - can see all schools' data
  {
    id: "user_001",
    school_id: "admin",
    name: "System Administrator",
    username: "admin",
    password: "admin2025",
    email: "admin@ibmathschoice.com",
    role: "admin"
  }
];

// Generate teacher and student users for each school dynamically
Object.keys(PREDEFINED_SCHOOLS).forEach((schoolKey, index) => {
  const school = PREDEFINED_SCHOOLS[schoolKey];
  const schoolCode = school.code.replace('REG-MATH-', ''); // Extract numeric part for username

  // Add teacher for this school
  PREDEFINED_USERS.push({
    id: `user_t${index + 1}`,
    school_id: school.id,
    name: `Teacher ${schoolCode}`,
    username: `teacher_${schoolCode}`,
    password: "teacher2025",
    email: `teacher_${schoolCode}@ibmathschoice.com`,
    role: "teacher"
  });

  // Add student for this school
  PREDEFINED_USERS.push({
    id: `user_s${index + 1}`,
    school_id: school.id,
    name: `Student ${schoolCode}`,
    username: `student_${schoolCode}`,
    password: "student2025",
    email: `student_${schoolCode}@ibmathschoice.com`,
    role: "student"
  });
});

// Verify a registration code
export const isValidRegistrationCode = (code: string): boolean => {
  return REGISTRATION_CODES.includes(code);
};

// Get school by code
export const getSchoolByCode = async (code: string): Promise<School | null> => {
  // In a real application, this would query Supabase
  // For demonstration, we're using predefined schools
  const schoolKey = Object.keys(PREDEFINED_SCHOOLS).find(
    key => PREDEFINED_SCHOOLS[key].code === code
  );
  
  if (!schoolKey) return null;
  
  return PREDEFINED_SCHOOLS[schoolKey];
};

// School authentication
export const authenticateSchool = async (code: string, password: string): Promise<School | null> => {
  // Find the school by code
  const schoolKey = Object.keys(PREDEFINED_SCHOOLS).find(
    key => PREDEFINED_SCHOOLS[key].code === code
  );
  
  if (!schoolKey) return null;
  
  const school = PREDEFINED_SCHOOLS[schoolKey];
  
  // Check password
  if (school.password !== password) return null;
  
  // Store school in local storage
  const schoolData: School = {
    id: school.id,
    name: school.name,
    code: school.code,
    logo_url: school.logo_url,
    primary_color: school.primary_color,
    secondary_color: school.secondary_color
  };
  
  localStorage.setItem('current_school', JSON.stringify(schoolData));
  return schoolData;
};

// User authentication within a school
export const authenticateUser = async (
  schoolId: string,
  username: string,
  password: string,
  role: SchoolRole
): Promise<SchoolUser | null> => {
  // Special case for admin who can see all schools
  if (username === "admin" && role === "admin") {
    const adminUser = PREDEFINED_USERS.find(
      user => user.username === username && user.password === password && user.role === role
    );
    
    if (adminUser) {
      const userData: SchoolUser = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        school_id: adminUser.school_id,
        role: adminUser.role
      };
      
      localStorage.setItem('current_user', JSON.stringify(userData));
      return userData;
    }
    
    return null;
  }
  
  // Find user by school_id, username, password and role
  const user = PREDEFINED_USERS.find(
    user => 
      user.school_id === schoolId && 
      user.username === username && 
      user.password === password && 
      user.role === role
  );
  
  if (!user) return null;
  
  // Store user in local storage
  const userData: SchoolUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    school_id: user.school_id,
    role: user.role
  };
  
  localStorage.setItem('current_user', JSON.stringify(userData));
  return userData;
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
  // In a real app, we would check if the current user is an admin
  // Here we're just returning all predefined schools
  return Object.values(PREDEFINED_SCHOOLS).map(school => ({
    id: school.id,
    name: school.name,
    code: school.code,
    logo_url: school.logo_url,
    primary_color: school.primary_color,
    secondary_color: school.secondary_color
  }));
};

// Create a new account for a student
export const createStudentAccount = async (
  schoolId: string,
  name: string,
  username: string,
  password: string
): Promise<SchoolUser | null> => {
  // In a real app, we would create a new user in Supabase
  // Here we're just simulating the creation
  const newId = `user_${Date.now()}`;
  
  const newUser = {
    id: newId,
    school_id: schoolId,
    name: name,
    username: username,
    password: password,
    email: `${username.toLowerCase()}@example.com`,
    role: 'student' as SchoolRole
  };
  
  // In a real application, we would insert this into Supabase
  // For this demo, we'll pretend it was successful
  
  const userData: SchoolUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    school_id: newUser.school_id,
    role: newUser.role
  };
  
  return userData;
};

// Get students by school ID
export const getStudentsBySchool = async (schoolId: string): Promise<SchoolUser[]> => {
  // Filter users to only return students from the given school
  // This ensures data isolation between schools
  const students = PREDEFINED_USERS
    .filter(user => user.school_id === schoolId && user.role === 'student')
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      school_id: user.school_id,
      role: user.role
    }));
    
  return students;
};

// Get teachers by school ID
export const getTeachersBySchool = async (schoolId: string): Promise<SchoolUser[]> => {
  // Filter users to only return teachers from the given school
  // This ensures data isolation between schools
  const teachers = PREDEFINED_USERS
    .filter(user => user.school_id === schoolId && user.role === 'teacher')
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      school_id: user.school_id,
      role: user.role
    }));
    
  return teachers;
};

// Check if user is an admin
export const isAdmin = (user: SchoolUser | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

// Check if user can access school data
export const canAccessSchoolData = (user: SchoolUser | null, schoolId: string): boolean => {
  if (!user) return false;
  
  // Admins can access any school's data
  if (user.role === 'admin') return true;
  
  // Users can only access their own school's data
  return user.school_id === schoolId;
};
