import React, { useState, useEffect } from 'react';
import { 
  School, 
  Globe, 
  Mail, 
  Building, 
  User, 
  KeyRound, 
  ShieldCheck, 
  LockKeyhole, 
  ArrowLeft, 
  CheckCircle, 
  CheckCheck, 
  AlertCircle
} from 'lucide-react';
import { registerNewSchool } from '../services/SchoolRegistrationService';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolRegistrationProps {
  onRegistrationComplete: (school: any) => void;
  onBack: () => void;
}

const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({ 
  onRegistrationComplete,
  onBack 
}) => {
  const [schoolName, setSchoolName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [schoolCode, setSchoolCode] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [step, setStep] = useState(1);

  const handleIframeLoad = () => {
    setVideoLoaded(true);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateRegistrationCode = (code: string): boolean => {
    return code.match(/^REG-MATH-\d{5}$/) !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolName.trim() || !adminName.trim() || !schoolEmail.trim() || !registrationCode.trim()) {
      setError('All fields are required');
      return;
    }
    
    // Validation for email
    if (!validateEmail(schoolEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validation for registration code
    if (!validateRegistrationCode(registrationCode)) {
      setError('Invalid registration code format. Please use the format REG-MATH-XXXXX');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Use the service to register the school
      const result = await registerNewSchool({
        name: schoolName,
        adminName,
        adminEmail: schoolEmail,
        registrationCode
      });
      
      if (result.success) {
        // Set the school code for display
        setSchoolCode(registrationCode);
        
        // Set success state
        setSuccess(true);
        
        // Notify parent component after a short delay
        setTimeout(() => {
          onRegistrationComplete(result.data);
        }, 5000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUpVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-lg w-full space-y-8 bg-white rounded-2xl shadow-xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <div className="h-3 bg-gradient-to-r from-green-400 to-green-500"></div>
          <div className="px-8 pt-8 pb-10 text-center">
            <motion.div 
              className="flex flex-col items-center justify-center"
              variants={slideUpVariants}
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCheck className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Registration Successful!
              </h2>
              <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                Your school has been successfully registered in the IB Mathematics Choice system.
              </p>
            </motion.div>
            
            <motion.div
              className="mb-8 text-left bg-green-50 p-6 rounded-xl border border-green-100"
              variants={itemVariants}
            >
              <h3 className="text-green-800 font-semibold text-lg mb-3 flex items-center">
                <Mail className="mr-2 h-5 w-5"/> Email Confirmation Sent
              </h3>
              <p className="text-green-700 mb-3">
                We've sent an email to <strong>{schoolEmail}</strong> with your access credentials and next steps.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">School admin account has been created</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Your unique school identifier is <span className="font-mono font-medium">{schoolCode}</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Password for initial login is <span className="font-mono font-medium">ibmaths2025</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You'll be redirected to your school admin dashboard</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <p className="text-sm text-gray-500 mb-6">
                You will be automatically redirected to your school dashboard in a few seconds.
              </p>
              <motion.button
                onClick={() => onBack()}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Dashboard Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  const nextStep = () => {
    if (step === 1) {
      if (!schoolName.trim() || !adminName.trim() || !schoolEmail.trim()) {
        setError('Please fill in all fields to continue');
        return;
      }
      
      if (!validateEmail(schoolEmail)) {
        setError('Please enter a valid email address');
        return;
      }
      
      setError('');
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Left side: Form */}
          <motion.div 
            className="lg:w-1/2"
            variants={itemVariants}
          >
            <div className="mb-6 flex items-center">
              <motion.button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mr-4"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Back to Login</span>
              </motion.button>
              
              <div className="h-0.5 flex-1 bg-gray-200"></div>
            </div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              variants={itemVariants}
            >
              <div className="h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>
              <div className="px-8 pt-8 pb-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-5">
                    <School className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    School Registration
                  </h2>
                  <div className="w-16 h-1 bg-indigo-500 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Join IB Mathematics Choice to help your students find their perfect mathematical path
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-8">
                  <div className={`flex flex-col items-center ${step === 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Building className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1">School Info</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                  <div className={`flex flex-col items-center ${step === 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1">Registration</span>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form 
                      className="space-y-6" 
                      key="step1"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="school-name" className="block text-sm font-medium text-gray-700 mb-1">
                            School Name
                          </label>
                          <div className="relative">
                            <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="school-name"
                              name="schoolName"
                              type="text"
                              required
                              className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter your school's full name"
                              value={schoolName}
                              onChange={(e) => setSchoolName(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="admin-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Administrator Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="admin-name"
                              name="adminName"
                              type="text"
                              required
                              className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="School administrator's full name"
                              value={adminName}
                              onChange={(e) => setAdminName(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="school-email" className="block text-sm font-medium text-gray-700 mb-1">
                            School Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="school-email"
                              name="schoolEmail"
                              type="email"
                              autoComplete="email"
                              required
                              className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Official school email address"
                              value={schoolEmail}
                              onChange={(e) => setSchoolEmail(e.target.value)}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">We'll send account details to this email</p>
                        </div>
                      </div>

                      {error && step === 1 && (
                        <motion.div 
                          className="p-4 text-sm text-red-700 bg-red-50 rounded-lg flex items-start"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="button"
                        onClick={nextStep}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 shadow-md text-base font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Registration
                      </motion.button>
                    </motion.form>
                  )}
                  
                  {step === 2 && (
                    <motion.form 
                      className="space-y-6" 
                      onSubmit={handleSubmit}
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <label htmlFor="registration-code" className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Code
                        </label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="registration-code"
                            name="registrationCode"
                            type="text"
                            required
                            className="pl-11 pr-4 py-3 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="REG-MATH-XXXXX"
                            value={registrationCode}
                            onChange={(e) => setRegistrationCode(e.target.value.toUpperCase())}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Enter the unique registration code provided by IB Mathematics Choice
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                          <LockKeyhole className="h-4 w-4 mr-1.5" /> Access Information
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                          <li className="flex items-start">
                            <div className="h-5 w-5 flex-shrink-0 text-blue-500 mr-1.5">•</div>
                            <span>Once registered, you'll receive full admin access to your school's dashboard</span>
                          </li>
                          <li className="flex items-start">
                            <div className="h-5 w-5 flex-shrink-0 text-blue-500 mr-1.5">•</div>
                            <span>You'll be able to view all student assessments and results</span>
                          </li>
                          <li className="flex items-start">
                            <div className="h-5 w-5 flex-shrink-0 text-blue-500 mr-1.5">•</div>
                            <span>Download reports in PDF, Excel, and CSV formats</span>
                          </li>
                        </ul>
                      </div>

                      {error && step === 2 && (
                        <motion.div 
                          className="p-4 text-sm text-red-700 bg-red-50 rounded-lg flex items-start"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <div className="flex gap-4">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm text-base font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Back
                        </motion.button>
                        
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 shadow-md text-base font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Registering...
                            </>
                          ) : (
                            <>Register School</>
                          )}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side: Video and Info */}
          <motion.div 
            className="lg:w-1/2 mt-10 lg:mt-0"
            variants={itemVariants}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Join IB Mathematics Choice?</h3>
                <div className="h-1 w-16 bg-indigo-500 rounded-full mb-4"></div>
                <p className="text-gray-600 mb-6">
                  Our platform helps schools guide students toward making the right choice between 
                  Analysis & Approaches (AA) and Applications & Interpretation (AI) courses, at both Higher and Standard levels.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Complete Administrative Control</h4>
                      <p className="text-sm text-gray-600">
                        Monitor all student assessments, track progress, and analyze results.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Secure & Private</h4>
                      <p className="text-sm text-gray-600">
                        Your school's data is completely isolated. Only your administrators can access your students' information.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Comprehensive Reports</h4>
                      <p className="text-sm text-gray-600">
                        Generate detailed reports of student performance and recommendations in multiple formats.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video w-full relative bg-gray-100">
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 z-10">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M8 5.5v13L19 12 8 5.5z"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="font-medium text-indigo-900">Loading video...</p>
                    </div>
                  )}
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/p84hgFI7EAI"
                    title="IB Mathematics Course Selection Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  ></iframe>
                </div>
                
                <div className="p-4 bg-gray-50 text-center">
                  <h4 className="font-medium text-gray-900">IB Mathematics 2019 Curriculum Overview</h4>
                  <p className="text-sm text-gray-600">
                    Understand the differences between AA and AI courses to better advise your students
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolRegistration;
