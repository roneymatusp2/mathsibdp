// For browser environment, we'll use import.meta.env instead of process.env
// Note: SendGrid client-side API calls aren't secure for production
// This is a simplified version for demonstration purposes

/**
 * Send school registration email with credentials
 * @param {Object} params - Email parameters
 * @param {string} params.toEmail - School admin email
 * @param {string} params.admin_name - Administrator's name
 * @param {string} params.school_name - School name
 * @param {string} params.school_code - School's unique code
 * @param {string} params.school_password - Admin password
 * @param {string} params.teacher_password - Teacher password
 * @param {string} params.student_password - Student password
 * @param {string} params.registration_date - Date of registration
 * @param {string} params.login_url - URL to access the platform
 * @returns {Promise<boolean>} Success status
 */
export async function sendSchoolRegistrationEmail({ 
  toEmail,
  admin_name,
  school_name,
  school_code,
  school_password,
  teacher_password,
  student_password,
  registration_date,
  login_url = 'https://ibmathschoice.com/login'
}) {
  console.log('Attempting to send email to', toEmail);
  
  // In a real implementation, we would call an API endpoint here
  // that would handle the SendGrid operation server-side
  
  // For demo purposes, we'll just log and return success
  console.log('Email data:', {
    to: toEmail,
    subject: `Welcome to IBMATHS CHOICE - ${school_name} Access Credentials`,
    templateData: {
      admin_name,
      school_name,
      school_code,
      school_password,
      teacher_password,
      student_password,
      registration_date: registration_date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      login_url,
      current_year: new Date().getFullYear()
    }
  });
  
  // Mock successful sending
  return Promise.resolve(true);
}

/**
 * Mock function for development/testing when SendGrid is not set up
 */
export function mockSendSchoolRegistrationEmail(params) {
  console.log('📧 MOCK EMAIL: Would send registration email with the following data:');
  console.log(JSON.stringify(params, null, 2));
  return Promise.resolve(true);
}

export default {
  sendSchoolRegistrationEmail,
  mockSendSchoolRegistrationEmail
};
