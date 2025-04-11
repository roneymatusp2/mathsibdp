import React, { useState } from 'react';
import { authenticateUser, SchoolRole } from '../services/schoolAuth';
import { User, GraduationCap, UserCircle } from 'lucide-react';

interface UserLoginProps {
  schoolId: string;
  schoolName: string;
  onUserLogin: (user: any) => void;
  onBack: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ schoolId, schoolName, onUserLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<SchoolRole>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await authenticateUser(schoolId, username, password, role);
      if (user) {
        onUserLogin(user);
      } else {
        setError(`Invalid username or password for ${role}`);
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
        <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        <div className="px-8 pt-6 pb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              {role === 'student' ? (
                <GraduationCap className="h-8 w-8 text-indigo-600" />
              ) : (
                <UserCircle className="h-8 w-8 text-indigo-600" />
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {role === 'student' ? 'Student Login' : 'Teacher Login'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to <span className="font-semibold">{schoolName}</span>
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                role === 'student'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
            >
              I'm a Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                role === 'teacher'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
            >
              I'm a Teacher
            </button>
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

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Back to School Login
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  </span>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                  </span>
                )}
                <span className="pl-8">
                  {loading ? 'Signing in...' : 'Sign in'}
                </span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Forgot your password? Contact your school administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;