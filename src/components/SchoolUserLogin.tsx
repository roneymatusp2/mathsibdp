import React, { useState } from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import { useSchoolTheme } from '../services/SchoolThemeProvider';
import { authenticateUser } from '../services/schoolAuth';
import { User, ArrowLeft } from 'lucide-react';

interface SchoolUserLoginProps {
  userType: 'teacher' | 'student';
  onBack: () => void;
  onLogin: (user: any) => void;
}

const SchoolUserLogin: React.FC<SchoolUserLoginProps> = ({ userType, onBack, onLogin }) => {
  const { currentSchool } = useSchoolAuth();
  const { primaryColor, secondaryColor, logoUrl, schoolName } = useSchoolTheme();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!currentSchool) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await authenticateUser(
        currentSchool.id, 
        username, 
        password, 
        userType
      );
      
      if (user) {
        onLogin(user);
      } else {
        setError(`Invalid ${userType} credentials. Please try again.`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
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
              <p className="text-sm text-gray-600">{userType === 'teacher' ? 'Teacher Login' : 'Student Login'}</p>
            </div>
          </div>
          
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    <User className="h-5 w-5 text-white" />
                  </span>
                )}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {userType === 'teacher' 
                ? 'Access to view and analyze student results' 
                : 'Access to take the math questionnaire and view your results'}
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Access Information</h3>
            <p className="text-xs text-blue-600 mt-1">
              {userType === 'teacher'
                ? 'As a teacher, you will have access to data for all students within your school only.'
                : 'As a student, you will only have access to your own questionnaire and results.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolUserLogin;
