import React, { useState } from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import { useSchoolTheme } from '../services/SchoolThemeProvider';
import { authenticateUser } from '../services/schoolAuth';
import { User, ArrowLeft, Lock, UserCircle, School, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    tap: { scale: 0.98 }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={itemVariants}
        >
          <div 
            className="h-3 bg-gradient-to-r from-primary to-secondary"
            style={{ 
              background: `linear-gradient(to right, ${primaryColor || '#4F46E5'}, ${secondaryColor || '#818CF8'})` 
            }}
          ></div>
          
          <div className="px-8 pt-8 pb-10">
            <motion.button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-primary mb-6 group"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:text-indigo-600" />
              <span className="text-sm font-medium group-hover:text-indigo-600">Back to school portal</span>
            </motion.button>
            
            <motion.div 
              className="flex flex-col items-center justify-center mb-8"
              variants={itemVariants}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mb-4">
                <School className="h-3.5 w-3.5 mr-1.5" />
                {userType === 'teacher' ? 'TEACHER ACCESS' : 'STUDENT ACCESS'}
              </div>
              
              <div className="flex items-center justify-center mb-4">
                {logoUrl ? (
                  <motion.img 
                    src={logoUrl} 
                    alt={schoolName || currentSchool.name} 
                    className="h-16 mr-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <motion.div 
                    className="h-16 w-16 rounded-full flex items-center justify-center mr-4 shadow-md"
                    style={{ backgroundColor: primaryColor || '#4F46E5' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl font-bold text-white">
                      {(schoolName || currentSchool.name).charAt(0)}
                    </span>
                  </motion.div>
                )}
                
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">{schoolName || currentSchool.name}</h2>
                  <div className="text-sm text-gray-600">
                    {userType === 'teacher' ? 'Teacher Login Portal' : 'Student Login Portal'}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              variants={itemVariants}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={userType === 'teacher' ? "Teacher username" : "Student username"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  className="p-4 text-sm text-red-700 bg-red-50 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white shadow-md text-base font-medium"
                style={{ 
                  backgroundColor: loading ? '#9CA3AF' : (primaryColor || '#4F46E5')
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
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
                    <User className="h-5 w-5 mr-2" />
                    Sign in as {userType === 'teacher' ? 'Teacher' : 'Student'}
                  </>
                )}
              </motion.button>
            </motion.form>
            
            <motion.div 
              className="mt-8 p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100"
              variants={itemVariants}
              style={{ 
                background: `linear-gradient(to right, ${primaryColor}05, ${secondaryColor}10)`,
                borderColor: `${primaryColor}30`
              }}
            >
              <h3 className="text-sm font-medium text-gray-800 mb-2">{userType === 'teacher' ? 'Teacher Access' : 'Student Access'}</h3>
              <p className="text-sm text-gray-600">
                {userType === 'teacher'
                  ? 'As a teacher at ' + (schoolName || currentSchool.name) + ', you can view and analyze results for all students within your school.'
                  : 'As a student at ' + (schoolName || currentSchool.name) + ', you can take the IB Mathematics questionnaire and view your personalized course recommendations.'}
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.p 
          className="mt-6 text-sm text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          &copy; {new Date().getFullYear()} IB Mathematics Choice. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SchoolUserLogin;
