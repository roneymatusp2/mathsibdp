import React, { useState, useEffect } from 'react';
import { authenticateSchool } from '../services/schoolAuth';
import { School, Globe } from 'lucide-react';

interface SchoolLoginProps {
  onSchoolLogin: (school: any) => void;
  onRegister: () => void;
}

const SchoolLogin: React.FC<SchoolLoginProps> = ({ onSchoolLogin, onRegister }) => {
  const [schoolsList, setSchoolsList] = useState<{name: string, code: string}[]>([]);
  const [showSchools, setShowSchools] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch from the server
    setSchoolsList([
      { name: "St. Paul's School", code: "STPAULS" },
      { name: "British College", code: "BRITCOL" },
      { name: "American School", code: "AMSCHOOL" },
      { name: "St. Francis College", code: "STFRAN" },
      { name: "Swiss-Brazilian School", code: "SUICO" },
      { name: "International School", code: "INTSCH" },
      { name: "Canadian International School", code: "CANINT" },
      { name: "French International School", code: "FRENCH" },
      { name: "German International School", code: "GERMAN" },
      { name: "Japanese International School", code: "JAPAN" },
      { name: "Beacon School", code: "BEACON" }
    ]);
  }, []);
  const [schoolCode, setSchoolCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolCode.trim() || !password.trim()) {
      setError('Please enter both school code and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const school = await authenticateSchool(schoolCode, password);
      if (school) {
        onSchoolLogin(school);
      } else {
        setError('Invalid school code or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectSchool = (schoolCode: string) => {
    setSchoolCode(schoolCode);
    setShowSchools(false);
  };

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
              School Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your school code and password to access IBMathsChoice
            </p>
          </div>
          
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <label htmlFor="school-code" className="sr-only">School Code</label>
                <input
                  id="school-code"
                  name="school-code"
                  type="text"
                  autoComplete="off"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="School Code"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  onFocus={() => setShowSchools(true)}
                />
                
                {/* School Dropdown */}
                {showSchools && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {schoolsList.map((school) => (
                      <div 
                        key={school.code}
                        className="px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center"
                        onClick={() => selectSchool(school.code)}
                      >
                        <span className="font-medium">{school.name}</span>
                        <span className="ml-2 text-xs text-gray-500">({school.code})</span>
                      </div>
                    ))}
                  </div>
                )}
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
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need assistance? Contact your IBMathsChoice administrator
            </p>
            <p className="text-sm mt-2">
              <button 
                onClick={onRegister}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                New school? Register here
              </button>
            </p>
          </div>
          
          {/* School Selection Guide */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">School Access Information</h3>
            <p className="text-xs text-blue-600 mt-1">
              This portal provides secure, isolated access for each school. Your data remains private and accessible only to your institution's authorized users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;