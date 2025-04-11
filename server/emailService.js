// This file should be used in a Node.js server environment, not in the browser
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY_HERE');

/**
 * Send school registration email with credentials
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} Success status
 */
export async function sendSchoolRegistrationEmail(params) {
  const { 
    toEmail,
    admin_name,
    school_name,
    school_code,
    school_password,
    teacher_password,
    student_password,
    registration_date,
    login_url = 'https://ibmathschoice.com/login'
  } = params;
  
  const msg = {
    to: toEmail,
    from: process.env.EMAIL_FROM || 'noreply@ibmathschoice.com', // Must be verified in SendGrid
    subject: `Welcome to IBMATHS CHOICE - ${school_name} Access Credentials`,
    templateId: 'd-516017b4560d489ab9bdccc7ac3392e3',
    dynamic_template_data: {
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
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Registration email sent to', toEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    return { 
      success: false, 
      error: error.response?.body || error.message 
    };
  }
}

// Express.js route handler example
export function setupEmailRoutes(app) {
  app.post('/api/send-registration-email', async (req, res) => {
    try {
      const result = await sendSchoolRegistrationEmail(req.body);
      if (result.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ 
          success: false, 
          error: result.error || 'Failed to send email' 
        });
      }
    } catch (error) {
      console.error('Email API error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error while sending email' 
      });
    }
  });
}
