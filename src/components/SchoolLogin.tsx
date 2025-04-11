import React, { useState } from 'react';
import { authenticateSchool, isValidRegistrationCode } from '../services/schoolAuth';
import { Building, Key, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchoolLoginProps {
  onSchoolLogin: (school: any) => void;
  onRegister?: () => void; // Made optional
}

const SchoolLogin: React.FC<SchoolLoginProps> = ({ onSchoolLogin, onRegister }) => {
  const [registrationCode, setRegistrationCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationCode.trim() || !password.trim()) {
      setError('Please enter both registration code and password');
      return;
    }
    
    // Validate registration code format
    if (!registrationCode.match(/^REG-MATH-\d{5}$/)) {
      setError('Invalid registration code format. Please use the format REG-MATH-XXXXX');
      return;
    }
    
    // Verify if this is a valid registration code
    if (!isValidRegistrationCode(registrationCode)) {
      setError('This registration code is not valid or has not been activated yet');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const school = await authenticateSchool(registrationCode, password);
      if (school) {
        onSchoolLogin(school);
      } else {
        setError('Invalid registration code or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="h-3 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="px-8 pt-8 pb-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-5">
                <Building className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                School Portal
              </h2>
              <p className="text-gray-600">
                Enter your registration code and password to access IB Mathematics Choice
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="registration-code" className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Code
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="registration-code"
                      name="registration-code"
                      type="text"
                      autoComplete="off"
                      required
                      className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="REG-MATH-XXXXX"
                      value={registrationCode}
                      onChange={(e) => setRegistrationCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the registration code provided by IB Mathematics Choice
                  </p>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="School password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md text-base font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Globe className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </motion.button>
              </div>
            </form>
            
            {onRegister && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Need assistance? Contact your IB Mathematics Choice administrator
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
            )}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Available registration codes for testing:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-400">
              <div>REG-MATH-94872</div>
              <div>REG-MATH-38751</div>
              <div>REG-MATH-29463</div>
              <div>REG-MATH-57390</div>
              <div>REG-MATH-16284</div>
            </div>
            <p className="text-xs text-gray-500 pt-2">Password for all schools: ibmaths2025</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">&copy; {new Date().getFullYear()} IB Mathematics Choice. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolLogin;