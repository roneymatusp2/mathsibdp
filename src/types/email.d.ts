/**
 * Interfaces for school registration email
 */

export interface SchoolRegistrationEmailParams {
  toEmail: string;           // School admin email
  admin_name: string;        // Administrator's name
  school_name: string;       // School name
  school_code: string;       // School's unique code
  school_password: string;   // Admin password
  teacher_password: string;  // Teacher password
  student_password: string;  // Student password
  registration_date?: string; // Date of registration (optional)
  login_url?: string;        // URL to access the platform (optional)
}

export interface SchoolRegistrationResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    code: string;
    createdAt: string;
  };
  error?: string;
}
