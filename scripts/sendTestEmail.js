/**
 * Script for sending a test email using the SendGrid integration
 * Usage: node scripts/sendTestEmail.js
 */

// Use ES module import syntax since the project is configured as type: "module"
import { sendSchoolRegistrationEmail } from '../src/services/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test data
const testEmailData = {
  toEmail: process.env.TEST_EMAIL || 'your-test-email@example.com', // Change this to your email for testing
  admin_name: 'Test Administrator',
  school_name: 'Test International School',
  school_code: 'TESTSCH',
  school_password: 'Admin$1234!@#',
  teacher_password: 'Teacher#5678!',
  student_password: 'Student$9012@',
  registration_date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  login_url: 'https://ibmathschoice.com/login'
};

// Function to send test email
async function sendTest() {
  console.log('Sending test email to:', testEmailData.toEmail);
  
  try {
    const result = await sendSchoolRegistrationEmail(testEmailData);
    
    if (result) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.error('❌ Failed to send test email');
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
}

// Execute the test
sendTest();
