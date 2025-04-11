import React from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import { useSchoolTheme } from '../services/SchoolThemeProvider';
import { LockKeyhole, UserPlus, UserCog } from 'lucide-react';

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
  
  if (!currentSchool) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="px-8 py-10">
          {/* School Logo & Welcome Message */}
          <div className="flex flex-col items-center mb-10">
            {logoUrl ? (
              <img src={logoUrl} alt={currentSchool.name} className="h-24 mb-6" />
            ) : (
              <div 
                className="h-24 w-24 rounded-full bg-primary flex items-center justify-center mb-6"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-3xl font-bold text-white">
                  {currentSchool.name.charAt(0)}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl font-extrabold text-gray-900 text-center">
              Welcome to {currentSchool.name}
            </h1>
            <p className="mt-3 text-lg text-gray-600 text-center max-w-2xl">
              Access IB Mathematics Choice to help students make informed decisions about their mathematics courses
            </p>
          </div>
          
          {/* Access Options */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {/* Teacher Access */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Teacher Access</h3>
              <p className="text-sm text-gray-600 mb-6">
                View student recommendations, analyze results, and generate reports.
              </p>
              <button
                onClick={onTeacherLogin}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Teacher Login
              </button>
            </div>
            
            {/* Student Access */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <LockKeyhole className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Student Login</h3>
              <p className="text-sm text-gray-600 mb-6">
                Already have an account? Log in to take the IB Math questionnaire or view your results.
              </p>
              <button
                onClick={onStudentLogin}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Student Login
              </button>
            </div>
            
            {/* Student Registration */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">New Student</h3>
              <p className="text-sm text-gray-600 mb-6">
                First time here? Register to receive a personalized Mathematics course recommendation.
              </p>
              <button
                onClick={onStudentRegister}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
          
          {/* School-specific Information */}
          <div className="mt-12 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">School Portal Information</h3>
            <p className="text-xs text-blue-600 mt-1">
              This is the exclusive portal for {currentSchool.name}. All data is securely isolated and only accessible by authorized users from your institution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolWelcome;
