import React, { useEffect, useState } from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import { useSchoolTheme } from '../services/SchoolThemeProvider';
import { LockKeyhole, UserPlus, UserCog, School, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchoolWelcomeProps {
  onTeacherLogin: () => void;
  onStudentLogin: () => void;
  onStudentRegister: () => void;
}

const SchoolWelcome: React.FC<SchoolWelcomeProps> = ({ 
  onTeacherLogin, 
  onStudentLogin,
  onStudentRegister
}) => {
  const { currentSchool } = useSchoolAuth();
  const { primaryColor, secondaryColor, logoUrl } = useSchoolTheme();
  
  const [greeting, setGreeting] = useState('Welcome');
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  if (!currentSchool) {
    return null;
  }
  
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
    hover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    tap: { scale: 0.98 }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div 
          className="h-3 bg-gradient-to-r from-primary to-secondary"
          style={{ 
            background: `linear-gradient(to right, ${primaryColor || '#4F46E5'}, ${secondaryColor || '#818CF8'})` 
          }}
        ></div>
        <div className="px-8 py-12">
          {/* School Logo & Welcome Message */}
          <motion.div 
            className="flex flex-col items-center mb-12"
            variants={itemVariants}
          >
            {logoUrl ? (
              <motion.img 
                src={logoUrl} 
                alt={currentSchool.name} 
                className="h-32 mb-8" 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div 
                className="h-32 w-32 rounded-full flex items-center justify-center mb-8 shadow-lg"
                style={{ backgroundColor: primaryColor || '#4F46E5' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-5xl font-bold text-white">
                  {currentSchool.name.charAt(0)}
                </span>
              </motion.div>
            )}
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mb-4">
                <School className="h-3.5 w-3.5 mr-1.5" />
                SCHOOL PORTAL
              </div>
              
              <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r" 
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${primaryColor || '#4F46E5'}, ${secondaryColor || '#818CF8'})` 
                  }}
                >
                  {greeting},
                </span>
              </h1>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {currentSchool.name}
              </h2>
              
              <p className="mt-3 text-xl text-gray-600 text-center max-w-2xl mx-auto">
                Welcome to your IB Mathematics Choice portal. Help your students make informed decisions about their mathematics courses.
              </p>
            </motion.div>
          </motion.div>
          
          {/* Access Options */}
          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-10"
            variants={itemVariants}
          >
            {/* Teacher Access */}
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors shadow-sm hover:shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <UserCog className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Teacher Access</h3>
              <p className="text-gray-600 mb-8 text-sm">
                View student recommendations, analyze results, and generate reports for your class.
              </p>
              <motion.button
                onClick={onTeacherLogin}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Teacher Login
                <ChevronRight className="ml-1 h-4 w-4" />
              </motion.button>
            </motion.div>
            
            {/* Student Login */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl border border-green-100 hover:border-green-300 transition-colors shadow-sm hover:shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ 
                background: `linear-gradient(to bottom right, ${primaryColor}10, ${secondaryColor}10)`,
                borderColor: `${primaryColor}30`
              }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <LockKeyhole className="h-7 w-7" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Login</h3>
              <p className="text-gray-600 mb-8 text-sm">
                Already have an account? Log in to take the IB Math questionnaire or view your results.
              </p>
              <motion.button
                onClick={onStudentLogin}
                className="w-full px-4 py-3 text-white rounded-lg flex items-center justify-center font-medium"
                style={{ backgroundColor: primaryColor }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Student Login
                <ChevronRight className="ml-1 h-4 w-4" />
              </motion.button>
            </motion.div>
            
            {/* Student Registration */}
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-100 hover:border-purple-300 transition-colors shadow-sm hover:shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                <UserPlus className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">New Student</h3>
              <p className="text-gray-600 mb-8 text-sm">
                First time here? Register to receive a personalized Mathematics course recommendation.
              </p>
              <motion.button
                onClick={onStudentRegister}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Register
                <ChevronRight className="ml-1 h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* School-specific Information */}
          <motion.div 
            className="mt-12 p-6 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50"
            variants={itemVariants}
            style={{ 
              background: `linear-gradient(to right, ${primaryColor}05, ${secondaryColor}10)`,
              borderColor: `${primaryColor}20`
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <Star className="h-5 w-5" style={{ color: primaryColor }} />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">School Portal Information</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This is the exclusive portal for <span className="font-medium">{currentSchool.name}</span>. 
                  All data is securely isolated and only accessible by authorized users from your institution.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.p 
        className="mt-6 text-sm text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        &copy; {new Date().getFullYear()} IB Mathematics Choice. All rights reserved.
      </motion.p>
    </div>
  );
};

export default SchoolWelcome;
