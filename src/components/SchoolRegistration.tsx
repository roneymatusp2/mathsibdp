import React, { useState } from 'react';
import { School, Globe, Mail } from 'lucide-react';
import { registerNewSchool } from '../services/SchoolRegistrationService';

interface SchoolRegistrationProps {
  onRegistrationComplete: (school: any) => void;
  onBack: () => void;
}

const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({ 
  onRegistrationComplete,
  onBack 
}) => {
  const [schoolName, setSchoolName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [schoolCode, setSchoolCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolName.trim() || !adminName.trim() || !schoolEmail.trim() || !registrationCode.trim()) {
      setError('All fields are required');
      return;
    }
    
    // Validation for email
    if (!schoolEmail.includes('@') || !schoolEmail.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Use the service to register the school
      const result = await registerNewSchool({
        name: schoolName,
        adminName,
        adminEmail: schoolEmail,
        registrationCode
      });
      
      if (result.success) {
        // Set the school code for display
        setSchoolCode(result.data.code);
        
        // Set success state
        setSuccess(true);
        
        // Notify parent component after a short delay
        setTimeout(() => {
          onRegistrationComplete(result.data);
        }, 3000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-500"></div>
          <div className="px-8 pt-6 pb-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-md text-gray-600 mb-4">
              Your school has been registered in the IBMATHS CHOICE system.
            </p>
            <p className="text-sm text-gray-600 mb-8">
              We've sent an email to <strong>{schoolEmail}</strong> with your access credentials and next steps.
            </p>
            <div className="bg-blue-50 p-4 rounded-md text-left mb-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Important Information</h3>
              <ul className="text-xs text-blue-600 list-disc pl-5 space-y-1">
                <li>Check your email for login credentials</li>
                <li>Your school code is <strong>{schoolCode}</strong></li>
                <li>Share the teacher and student passwords as needed</li>
                <li>Consider changing your passwords after first login</li>
              </ul>
            </div>
            <button
              onClick={() => onBack()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        <div className="px-8 pt-6 pb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <School className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              School Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Register your school to access the IBMATHS CHOICE system
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="school-name" className="sr-only">School Name</label>
                <input
                  id="school-name"
                  name="schoolName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="admin-name" className="sr-only">Administrator Name</label>
                <input
                  id="admin-name"
                  name="adminName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Administrator Name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="school-email" className="sr-only">School Email</label>
                <input
                  id="school-email"
                  name="schoolEmail"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="School Email"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="registration-code" className="sr-only">Registration Code</label>
                <input
                  id="registration-code"
                  name="registrationCode"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Registration Code"
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  </span>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <Globe className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                  </span>
                )}
                {loading ? 'Registering...' : 'Register School'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already registered? <button onClick={onBack} className="font-medium text-indigo-600 hover:text-indigo-500">Go back to login</button>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Registration Information</h3>
            <p className="text-xs text-blue-600 mt-1">
              After registration, you'll receive an email with login credentials for administrators, teachers, and students. Your school's data will be completely isolated from other schools in the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
