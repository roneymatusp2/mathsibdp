import React, { useState } from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import { useSchoolTheme } from '../services/SchoolThemeProvider';
import { createStudentAccount } from '../services/schoolAuth';
import { UserPlus, ArrowLeft } from 'lucide-react';

interface SchoolStudentRegistrationProps {
  onBack: () => void;
  onRegisterSuccess: (user: any) => void;
}

const SchoolStudentRegistration: React.FC<SchoolStudentRegistrationProps> = ({ 
  onBack,
  onRegisterSuccess
}) => {
  const { currentSchool } = useSchoolAuth();
  const { primaryColor, secondaryColor, logoUrl, schoolName } = useSchoolTheme();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!currentSchool) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName.trim() || !email.trim() || !username.trim() || !password) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Email validation - simple check
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await createStudentAccount(
        currentSchool.id,
        fullName,
        username,
        password
      );
      
      if (user) {
        onRegisterSuccess(user);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      // Check for duplicate username
      if (err.message && err.message.includes('duplicate')) {
        setError('This username is already taken. Please choose another one.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div 
          className="h-2 bg-gradient-to-r from-primary to-secondary"
          style={{ 
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
          }}
        ></div>
        
        <div className="px-8 pt-6 pb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Back to school options</span>
          </button>
          
          <div className="flex items-center justify-center mb-6">
            {logoUrl ? (
              <img src={logoUrl} alt={schoolName} className="h-12 mr-3" />
            ) : (
              <div 
                className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mr-3"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-xl font-bold text-white">
                  {schoolName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{schoolName}</h2>
              <p className="text-sm text-gray-600">Student Registration</p>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="full-name" className="sr-only">Full Name</label>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email Address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: loading ? '#9CA3AF' : primaryColor,
                  ':hover': { backgroundColor: '#4338CA' }
                }}
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  </span>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <UserPlus className="h-5 w-5 text-white" />
                  </span>
                )}
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Registration Information</h3>
            <p className="text-xs text-blue-600 mt-1">
              As a student at {schoolName}, you'll have secure access to the IB Mathematics Choice questionnaire and your personalized results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolStudentRegistration;
