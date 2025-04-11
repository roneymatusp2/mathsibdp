import React, { useState } from 'react';
import { ArrowRight, School } from 'lucide-react';

interface StudentInfoProps {
  onSubmit: (name: string) => void;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ onSubmit }) => {
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    onSubmit(studentName);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <School className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Welcome to IBMathsChoice
          </h2>
          
          <p className="text-gray-600 mb-6">
            To begin the questionnaire, we need to know your name. Your responses will be saved and can be accessed by your school administrator.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setError('');
                }}
                className={`block w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your full name"
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-500">
                School: St. Paul's School
              </p>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;