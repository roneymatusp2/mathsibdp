import { supabase } from './supabase.js';
import { sendSchoolRegistrationEmail, mockSendSchoolRegistrationEmail } from './emailService.js';

/**
 * Registers a new school in the system and sends welcome email with credentials
 * @param {Object} schoolData - The school registration data
 * @param {string} schoolData.name - School name
 * @param {string} schoolData.adminName - Administrator name
 * @param {string} schoolData.adminEmail - Administrator email
 * @param {string} schoolData.registrationCode - Registration code provided by admin
 * @returns {Promise<Object>} The registration result
 */
export const registerNewSchool = async ({ 
  name, 
  adminName, 
  adminEmail, 
  registrationCode 
}) => {
  try {
    // 1. Verify registration code
    const { data: codeData, error: codeError } = await supabase
      .from('registration_codes')
      .select('*')
      .eq('code', registrationCode)
      .eq('used', false)
      .single();
    
    if (codeError || !codeData) {
      return { 
        success: false, 
        error: 'Invalid or already used registration code' 
      };
    }
    
    // 2. Generate school code and passwords
    const schoolCode = generateSchoolCode(name);
    const schoolPassword = generateSecurePassword();
    const teacherPassword = generateSecurePassword();
    const studentPassword = generateSecurePassword();
    
    // 3. Create the school entry
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .insert([{
        name,
        code: schoolCode,
        password: schoolPassword,
        admin_name: adminName,
        admin_email: adminEmail,
        teacher_password: teacherPassword,
        student_password: studentPassword,
        primary_color: '#4f46e5',
        secondary_color: '#3b82f6'
      }])
      .select()
      .single();
      
    if (schoolError) {
      console.error('School registration error:', schoolError);
      return { 
        success: false, 
        error: 'Error registering school. Please try again.' 
      };
    }
    
    // 4. Mark the registration code as used
    await supabase
      .from('registration_codes')
      .update({ 
        used: true, 
        used_by: schoolData.id,
        used_at: new Date().toISOString()
      })
      .eq('code', registrationCode);
    
    // 5. Send welcome email with credentials
    const registrationDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Check if we're in development mode
    const isDev = import.meta.env.MODE === 'development';
    
    // Use the mock function if in development, otherwise use real function
    const emailFunction = isDev 
      ? mockSendSchoolRegistrationEmail 
      : sendSchoolRegistrationEmail;
      
    await emailFunction({
      toEmail: adminEmail,
      admin_name: adminName,
      school_name: name,
      school_code: schoolCode,
      school_password: schoolPassword,
      teacher_password: teacherPassword,
      student_password: studentPassword,
      registration_date: registrationDate,
      login_url: `${window.location.origin}/login`
    });
    
    // 6. Return success with limited data (don't expose passwords)
    return { 
      success: true, 
      data: {
        id: schoolData.id,
        name: schoolData.name,
        code: schoolData.code,
        createdAt: schoolData.created_at
      } 
    };
    
  } catch (err) {
    console.error('Registration process error:', err);
    return { 
      success: false, 
      error: 'An error occurred during registration. Please try again.' 
    };
  }
};

/**
 * Generates a school code based on the school name
 * @param {string} name - School name
 * @returns {string} - School code
 */
const generateSchoolCode = (name) => {
  // Convert to uppercase, remove special chars, take first 6 chars
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 6);
};

/**
 * Generates a secure random password
 * @returns {string} A secure password
 */
const generateSecurePassword = () => {
  // Characters to use in password
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Omit O, I for readability
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz'; // Omit l for readability
  const numberChars = '23456789'; // Omit 0, 1 for readability
  const specialChars = '@#$%&*!';
  
  // Ensure at least one of each type
  let password = '';
  password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Add additional random characters until we reach length 12
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  while (password.length < 12) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export default {
  registerNewSchool
};
