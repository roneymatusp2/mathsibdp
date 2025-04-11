/**
 * Script for directly testing SendGrid email sending
 * This script doesn't rely on application code and can be used independently
 */

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root .env file
const envPath = resolve(__dirname, '../.env');
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
  console.error('Error loading .env file:', envConfig.error);
  process.exit(1);
}

// Set SendGrid API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('ERROR: SENDGRID_API_KEY is not defined in your .env file');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

// Email receiver (change this to your email for testing)
const toEmail = process.argv[2] || process.env.TEST_EMAIL || 'your-test-email@example.com';

// Current date for the email template
const registrationDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Email content
const msg = {
  to: toEmail,
  from: process.env.EMAIL_FROM || 'noreply@ibmathschoice.com',
  subject: 'IBMATHS CHOICE - Test Email',
  templateId: 'd-516017b4560d489ab9bdccc7ac3392e3',
  dynamic_template_data: {
    admin_name: 'Test Administrator',
    school_name: 'Test International School',
    school_code: 'TESTSCH',
    school_password: 'Admin$1234!@#',
    teacher_password: 'Teacher#5678!',
    student_password: 'Student$9012@',
    registration_date: registrationDate,
    login_url: 'https://ibmathschoice.com/login',
    current_year: new Date().getFullYear()
  }
};

// Send the email
console.log(`🚀 Sending test email to: ${toEmail}`);
console.log(`📧 Using SendGrid API Key: ${apiKey.substring(0, 10)}...`);

sgMail.send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ Error sending email:');
    console.error(error.response?.body || error);
  });
