import React, { useState, useEffect } from 'react';
import { authenticateSchool, isValidRegistrationCode } from '../services/schoolAuth';
import { 
  Building, 
  Key, 
  Globe, 
  Shield, 
  BookOpen, 
  Sigma, 
  Calculator, 
  LineChart,
  TrendingUp,
  BrainCircuit,
  Award,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  ArrowDown,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolLoginProps {
  onSchoolLogin: (school: any) => void;
  onRegister?: () => void; // Made optional
}

const SchoolLogin: React.FC<SchoolLoginProps> = ({ onSchoolLogin, onRegister }) => {
  const [registrationCode, setRegistrationCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Dynamic gradient background animation
  const [gradientDegree, setGradientDegree] = useState(45);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientDegree(prev => (prev + 1) % 360);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleIframeLoad = () => {
    setVideoLoaded(true);
  };

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
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2
      } 
    }
  };
  
  const iconFeatures = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-indigo-600" />,
      title: "Personalized Path",
      description: "Guide students to the perfect math course for their skills and goals"
    },
    {
      icon: <LineChart className="w-6 h-6 text-indigo-600" />,
      title: "Data-Driven Insights",
      description: "Comprehensive analytics to track student progress and aptitude"
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: "IB Excellence",
      description: "Optimized for the latest IB Mathematics curriculum framework"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: "Proven Results",
      description: "96% of students report better performance in their recommended courses"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <motion.div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Left Side - Information and Video */}
        <div className="lg:w-1/2 space-y-8">
          <motion.div 
            variants={fadeUpVariants}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Sigma className="h-12 w-12 text-indigo-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">IB Mathematics <span className="text-indigo-600">Choice</span></h1>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Find Your Perfect Mathematical Path
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              The comprehensive assessment platform for IB schools to help students 
              choose between Analysis & Approaches (AA) and Applications & Interpretation (AI) 
              at both Higher and Standard levels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {iconFeatures.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex p-4 bg-white rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <div className="flex-shrink-0 mr-3">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            variants={fadeUpVariants} 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
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
                  <p className="font-medium text-indigo-900">Loading IB Mathematics video...</p>
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
            
            <div className="p-4 bg-indigo-50">
              <p className="text-sm text-center text-indigo-800 font-medium">
                Watch this video to understand the differences between AA and AI courses
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeUpVariants}
            className="flex items-center justify-center lg:justify-start gap-8 pt-2"
          >
            <div className="flex items-center text-indigo-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">10,000+ Students</span>
            </div>
            <div className="flex items-center text-indigo-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">250+ Schools</span>
            </div>
            <div className="flex items-center text-indigo-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">96% Satisfaction</span>
            </div>
          </motion.div>
          
          {/* Mobile CTA - Visible only on small screens */}
          <div className="block lg:hidden text-center">
            <button 
              onClick={() => document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center text-indigo-600 font-medium text-lg hover:text-indigo-800"
            >
              Sign in to your school portal
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </button>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="lg:w-5/12 w-full" id="login-form">
          <motion.div
            variants={fadeUpVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div 
              className="h-3" 
              style={{ 
                background: `linear-gradient(${gradientDegree}deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)` 
              }}
            ></div>
            <div className="px-8 pt-8 pb-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-5">
                  <Building className="h-10 w-10 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
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
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 text-sm text-red-700 bg-red-50 rounded-lg"
                  >
                    {error}
                  </motion.div>
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
            variants={fadeUpVariants}
            className="text-center mt-6"
          >
            <div 
              className="p-4 bg-white rounded-xl shadow-sm border border-indigo-100"
              onClick={() => setShowInfo(!showInfo)}
            >
              <button 
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-gray-700">Available testing credentials</span>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${showInfo ? 'transform rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showInfo && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <p className="text-xs text-gray-500 mb-2">Available registration codes for testing:</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-indigo-600 font-mono">
                      <div>REG-MATH-94872</div>
                      <div>REG-MATH-38751</div>
                      <div>REG-MATH-29463</div>
                      <div>REG-MATH-57390</div>
                      <div>REG-MATH-16284</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Password for all schools: <span className="font-mono">ibmaths2025</span></p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">&copy; {new Date().getFullYear()} IB Mathematics Choice. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* How It Works Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-indigo-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How IB Mathematics Choice Works</h2>
            <div className="h-1 w-24 bg-indigo-600 mx-auto my-4 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive framework to guide students to their optimal mathematics course
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 relative"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">1</div>
              <div className="pt-6">
                <Calculator className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Skills Assessment</h3>
                <p className="text-gray-600">
                  Students complete a comprehensive skills assessment that evaluates mathematical 
                  aptitude across key domains relevant to both AA and AI courses.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 relative"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">2</div>
              <div className="pt-6">
                <BrainCircuit className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Intelligent Analysis</h3>
                <p className="text-gray-600">
                  Our algorithm analyzes performance data, identifying patterns and strengths to 
                  determine the optimal mathematical path for each student.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 relative"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">3</div>
              <div className="pt-6">
                <GraduationCap className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Recommendation</h3>
                <p className="text-gray-600">
                  Schools receive detailed reports with course recommendations, confidence scores, 
                  and specific areas of strength and opportunity for each student.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolLogin;