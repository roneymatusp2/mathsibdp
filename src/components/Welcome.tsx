import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  Calculator, 
  BarChart, 
  Sparkles,
  ChevronRight,
  Check,
  Star,
  Award,
  Lightbulb,
  GraduationCap,
  TrendingUp,
  Globe,
  Map
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeProps {
  onStart: () => void;
}

function Welcome({ onStart }: WelcomeProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const handleIframeLoad = () => {
    setVideoLoaded(true);
  };

  // Gradient animation effect
  const [gradientPosition, setGradientPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const gradientStyle = {
    backgroundSize: '200% 200%',
    backgroundPosition: `${gradientPosition}% ${gradientPosition}%`,
    transition: 'background-position 0.5s ease'
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50"></div>
        <motion.div 
          className="absolute top-10 right-10 w-64 h-64 rounded-full bg-purple-200 opacity-20 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-200 opacity-20 blur-3xl"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-1/4 left-1/3 w-40 h-40 rounded-full bg-indigo-300 opacity-10 blur-2xl"
          animate={{ 
            x: [0, 40, 0], 
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 lg:py-32 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="mb-6">
                <motion.div
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-xs font-bold tracking-wider"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  IB MATHEMATICS PATHWAY FINDER
                </motion.div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
                <span className="block text-gray-900">Discover Your</span>
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 bg-clip-text text-transparent" style={gradientStyle}>
                  Ideal IB Math Path
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10">
                Our intelligent assessment guides you to the perfect IB Mathematics course that aligns with your strengths, learning style, and future academic goals.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <motion.button
                  onClick={onStart}
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-lg text-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
                </motion.button>
                
                <a 
                  href="#info" 
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm text-lg"
                >
                  Learn More
                  <ChevronRight className="ml-1 h-5 w-5" />
                </a>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span>5-minute assessment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Personalized recommendation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Expert guidance</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur-sm opacity-70"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <div className="aspect-video w-full relative">
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
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <div className="flex items-center text-xs bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full">
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                  Official IB Mathematics guidance video
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Course Overview Cards */}
      <motion.section 
        id="info" 
        className="py-20 px-6 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-full px-4 py-1 mb-3">
              EXPLORE PATHWAYS
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Choose Your Mathematical Journey
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              The IB offers two mathematics courses at both Higher and Standard levels,
              each designed to match different learning styles and career aspirations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-3 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-green-100 rounded-2xl p-4 flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-gray-800 mb-3">Analysis & Approaches (AA)</h3>
                    <p className="text-gray-600 mb-6 text-lg">For students who enjoy developing mathematical arguments, problem-solving, and exploring pure mathematical concepts with and without technology.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center bg-green-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Strong Pure Math Focus</span>
                      </div>
                      <div className="flex items-center bg-green-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Advanced Calculus</span>
                      </div>
                      <div className="flex items-center bg-green-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Less Technology-Focused</span>
                      </div>
                      <div className="flex items-center bg-green-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Theoretical Approach</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 border border-green-200 rounded-xl p-4 bg-green-50">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center mr-2">
                            <TrendingUp className="h-4 w-4 text-green-700" />
                          </div>
                          <div className="font-semibold text-green-800">Higher Level</div>
                        </div>
                        <p className="text-sm text-green-700">For future engineers, mathematicians, physicists, and technical fields.</p>
                      </div>
                      <div className="flex-1 border border-green-200 rounded-xl p-4 bg-white">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-2">
                            <Map className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="font-semibold text-green-700">Standard Level</div>
                        </div>
                        <p className="text-sm text-green-600">For students who need mathematics for subjects like chemistry, economics, etc.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-3 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-blue-100 rounded-2xl p-4 flex-shrink-0">
                    <BarChart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-gray-800 mb-3">Applications & Interpretation (AI)</h3>
                    <p className="text-gray-600 mb-6 text-lg">For students who enjoy seeing mathematics used in real-world contexts and who are interested in exploring mathematical models and technology.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center bg-blue-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Statistics & Modeling</span>
                      </div>
                      <div className="flex items-center bg-blue-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Real-world Problems</span>
                      </div>
                      <div className="flex items-center bg-blue-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Technology Integration</span>
                      </div>
                      <div className="flex items-center bg-blue-50 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Practical Applications</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 border border-blue-200 rounded-xl p-4 bg-blue-50">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center mr-2">
                            <TrendingUp className="h-4 w-4 text-blue-700" />
                          </div>
                          <div className="font-semibold text-blue-800">Higher Level</div>
                        </div>
                        <p className="text-sm text-blue-700">For future economists, social scientists, and business majors.</p>
                      </div>
                      <div className="flex-1 border border-blue-200 rounded-xl p-4 bg-white">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                            <Map className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="font-semibold text-blue-700">Standard Level</div>
                        </div>
                        <p className="text-sm text-blue-600">For students who need practical mathematics for non-mathematical subjects.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-1">
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl overflow-hidden">
              <div className="px-8 py-16 md:p-16 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.h2 
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Ready to discover your ideal path?
                  </motion.h2>
                  
                  <p className="text-xl text-indigo-100 mb-10 max-w-2xl">
                    Take 5 minutes now to complete our assessment and receive your personalized
                    recommendation backed by IB mathematics expertise.
                  </p>
                  
                  <motion.button
                    onClick={onStart}
                    className="inline-flex items-center px-10 py-5 bg-white text-indigo-700 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Your Assessment
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </motion.button>
                  
                  <p className="mt-6 text-indigo-200 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Takes approximately 5 minutes to complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">IBMathsChoice</p>
            </div>
            
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} IBMathsChoice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add missing component
const Clock = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default Welcome;