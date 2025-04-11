import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail } from 'lucide-react';

interface SaveResultsFormProps {
  studentInfo?: { name: string; email: string } | null;
  onSaveResults: (name: string, email: string) => void;
  itemVariants: any;
}

const SaveResultsForm: React.FC<SaveResultsFormProps> = ({
  studentInfo,
  onSaveResults,
  itemVariants,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(studentInfo?.name || '');
  const [email, setEmail] = useState(studentInfo?.email || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveResults(name, email);
    setShowForm(false);
  };

  if (studentInfo) {
    // If student info is already available, don't show the save form/button
    return null;
  }

  return (
    <motion.div className="mb-8" variants={itemVariants}>
      {!showForm ? (
        <motion.div 
          className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 shadow-md border border-yellow-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
              <svg
                className="h-6 w-6 text-yellow-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Save Your Recommendation
              </h3>
              <p className="text-gray-700 mb-4">
                Would you like to save your results to your student profile? Your math teacher will be able to review your recommendation.
              </p>
              <div className="mt-5 flex">
                <motion.button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white shadow-md bg-gradient-to-r from-school-navy to-blue-600 hover:from-school-navy/90 hover:to-blue-700"
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save My Results
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="ml-3 inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">
              Student Information
            </h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              Please provide your details to save your recommendation
            </p>
          </div>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="mb-4">
                <div className="relative rounded-md shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="peer focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 border-gray-300 rounded-lg"
                    placeholder=" " 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-9"
                  >
                    Full Name
                  </label>
                </div>
              </div>

              <div>
                <div className="relative rounded-md shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="peer focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 border-gray-300 rounded-lg"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-9"
                  >
                    School Email
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <motion.button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md flex-1"
                whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ y: 0, boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)' }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save My Results
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SaveResultsForm;

