// This is a mock email service
// In a production environment, you would integrate with an actual email service
// like SendGrid, Mailgun, AWS SES, etc.

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  // In a real implementation, this would call an email service API
  console.log(`Sending email to ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Body: ${options.body.substring(0, 100)}...`);
  
  // Mock successful sending
  return true;
};

export const sendWelcomeEmail = async (
  email: string,
  adminName: string,
  schoolName: string,
  schoolCode: string,
  schoolPassword: string,
  teacherPassword: string,
  studentPassword: string
): Promise<boolean> => {
  const subject = `Welcome to IBMaths Choice - ${schoolName} Access Credentials`;
  
  const emailBody = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .credentials { background-color: #e0e7ff; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .credential-item { margin-bottom: 10px; }
          .credential-label { font-weight: bold; }
          .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to IBMaths Choice</h1>
          </div>
          <div class="content">
            <p>Dear ${adminName},</p>
            <p>Thank you for registering ${schoolName} with the IBMaths Choice system. Your school has been successfully set up in our platform.</p>
            
            <p>Below are your access credentials. Please keep this information secure and share only with authorized personnel:</p>
            
            <div class="credentials">
              <h3>School Administrator Access</h3>
              <div class="credential-item">
                <span class="credential-label">School Code:</span> ${schoolCode}
              </div>
              <div class="credential-item">
                <span class="credential-label">School Password:</span> ${schoolPassword}
              </div>
              <p>Use these credentials to access the IBMaths Choice portal as a school administrator.</p>
            </div>
            
            <div class="credentials">
              <h3>Teacher Access</h3>
              <div class="credential-item">
                <span class="credential-label">School Code:</span> ${schoolCode}
              </div>
              <div class="credential-item">
                <span class="credential-label">Teacher Password:</span> ${teacherPassword}
              </div>
              <p>Share this password with teachers at your school who need access to student data and analytics.</p>
            </div>
            
            <div class="credentials">
              <h3>Student Access</h3>
              <div class="credential-item">
                <span class="credential-label">School Code:</span> ${schoolCode}
              </div>
              <div class="credential-item">
                <span class="credential-label">Student Password:</span> ${studentPassword}
              </div>
              <p>Share this password with students who need to take the IB Mathematics questionnaire.</p>
            </div>
            
            <p>For security reasons, we recommend changing these passwords after your first login. Each school's data is completely isolated in our system, ensuring privacy and security.</p>
            
            <p>If you have any questions or need assistance, please contact our support team at support@ibmathschoice.com.</p>
            
            <p>Best regards,<br>The IBMaths Choice Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} IBMaths Choice. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    body: emailBody,
    isHtml: true
  });
};
