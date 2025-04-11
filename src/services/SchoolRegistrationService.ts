import { supabase } from './supabase';
import { isValidRegistrationCode } from './schoolAuth';

// Type for school registration request
export interface SchoolRegistrationRequest {
  name: string;
  adminName: string;
  adminEmail: string;
  registrationCode: string;
  password?: string;
}

// Type for school registration response
export interface SchoolRegistrationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Register a new school in the system
 * @param registrationData The registration data for the school
 * @returns A promise with the registration result
 */
export const registerNewSchool = async (
  registrationData: SchoolRegistrationRequest
): Promise<SchoolRegistrationResponse> => {
  try {
    // Validate registration code
    if (!isValidRegistrationCode(registrationData.registrationCode)) {
      return {
        success: false,
        error: 'Invalid registration code. Please enter a valid code provided by IB Mathematics Choice.'
      };
    }

    // Generate a unique school ID
    const schoolId = `school_${Date.now()}`;
    
    // Generate a unique code for the school
    const schoolCode = registrationData.registrationCode;
    
    // Create default password for the school if not provided
    const password = registrationData.password || 'ibmaths2025';
    
    // In a real app, we would insert school data into the database
    // Here we're just simulating a successful response
    
    const schoolData = {
      id: schoolId,
      name: registrationData.name,
      code: schoolCode,
      adminName: registrationData.adminName,
      adminEmail: registrationData.adminEmail,
      primary_color: '#3B82F6',
      secondary_color: '#6366F1',
      created_at: new Date().toISOString()
    };
    
    // In a real app, we would also create admin user accounts
    // and send welcome emails with credentials
    
    // Simulate a delay for the API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: schoolData
    };
  } catch (error: any) {
    console.error('School registration error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during registration'
    };
  }
}; 