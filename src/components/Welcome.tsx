import React, { useState } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  Calculator, 
  BarChart as ChartBar, 
  Play, 
  ChevronRight,
  Check,
  Star,
  Compass,
  Award,
  UserCheck,
  School,
  GraduationCap
} from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

function Welcome({ onStart }: WelcomeProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const handleIframeLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="lg:flex-1 lg:pr-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent text-sm font-bold tracking-wider mb-3">
            IB MATHEMATICS COURSE ADVISOR
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Find your ideal path in <span className="text-indigo-600">IB Mathematics</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Our tailored questionnaire will help determine the IB math course that best matches your
            learning style, abilities, and future academic goals.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={onStart}
              className="inline-flex items-center px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 text-lg"
            >
              Start Questionnaire
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>5-minute assessment</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Personalized recommendation</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Expert guidance</span>
            </div>
          </div>
        </div>
        
        <div className="lg:flex-1 w-full max-w-2xl">
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-video w-full relative z-10">
              {!videoLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 z-10">
                  <Play className="h-16 w-16 text-indigo-600 mb-4" />
                  <p className="font-medium text-indigo-900">Loading video...</p>
                </div>
              )}
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/GwisekGc2kY"
                title="IB Mathematics Course Selection Guide"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleIframeLoad}
              ></iframe>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <div className="text-xs text-center text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Official IB Mathematics guidance video
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview Cards */}
      <div id="about" className="mb-20 scroll-mt-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-full px-4 py-1 mb-3">
            COURSE OPTIONS
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            IB Mathematics Pathways
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            The IB offers two mathematics courses at both Higher and Standard levels,
            each designed to cater to different student needs and abilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-2 bg-green-500"></div>
            <div className="p-8">
              <div className="flex items-start gap-5">
                <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Analysis & Approaches (AA)</h3>
                  <p className="text-gray-600 mb-5">For students who enjoy developing mathematical arguments, problem-solving, and exploring real and abstract applications with and without technology.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Strong Pure Math Focus</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Advanced Calculus</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Less Technology-Focused</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Theoretical Approach</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 border border-green-500 rounded-lg p-3 bg-green-50">
                      <div className="font-semibold text-green-800 mb-1">HL (Higher Level)</div>
                      <p className="text-sm text-green-700">For future engineers, mathematicians, physicists, and technical fields.</p>
                    </div>
                    <div className="flex-1 border border-green-300 rounded-lg p-3 bg-green-50/50">
                      <div className="font-semibold text-green-700 mb-1">SL (Standard Level)</div>
                      <p className="text-sm text-green-600">For students who need mathematics for subjects like chemistry, economics, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-2 bg-blue-500"></div>
            <div className="p-8">
              <div className="flex items-start gap-5">
                <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                  <ChartBar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Applications & Interpretation (AI)</h3>
                  <p className="text-gray-600 mb-5">For students who enjoy seeing mathematics used in real-world contexts, who are interested in harnessing technology and exploring mathematical models.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Statistics & Modeling</span>
                    </div>
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Real-world Problems</span>
                    </div>
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Technology Integration</span>
                    </div>
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">Practical Applications</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 border border-blue-500 rounded-lg p-3 bg-blue-50">
                      <div className="font-semibold text-blue-800 mb-1">HL (Higher Level)</div>
                      <p className="text-sm text-blue-700">For future economists, social scientists, and business majors.</p>
                    </div>
                    <div className="flex-1 border border-blue-300 rounded-lg p-3 bg-blue-50/50">
                      <div className="font-semibold text-blue-700 mb-1">SL (Standard Level)</div>
                      <p className="text-sm text-blue-600">For students who need practical mathematics for non-mathematical subjects.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire Benefits */}
      <div className="bg-white rounded-xl shadow-lg mb-20 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        <div className="p-10">
          <div className="text-center mb-10">
            <School className="h-12 w-12 mx-auto text-indigo-600 mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">About This Questionnaire</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              This questionnaire was designed by IB Mathematics experts to guide you
              toward the most suitable IB mathematics course based on your unique profile.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
              <div className="bg-white w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-md">
                <Compass className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Career Alignment</h3>
              <p className="text-gray-600 text-sm">
                Aligns your course selection with your future career aspirations and university requirements.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="bg-white w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-md">
                <BrainCircuit className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Learning Style</h3>
              <p className="text-gray-600 text-sm">
                Analyzes your learning preferences and mathematical thinking style to match you with the appropriate approach.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
              <div className="bg-white w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-md">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Confidence Score</h3>
              <p className="text-gray-600 text-sm">
                Provides a personalized confidence rating for your recommended course with detailed explanation.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-10">
            <div className="flex items-start">
              <div className="hidden md:block">
                <Award className="h-8 w-8 text-indigo-600 mr-6 mt-2" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-6 w-6 text-indigo-600 mr-2 md:hidden" />
                  How This Will Help Your IB Success
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Tailored Course Selection:</span> Find the mathematics course that aligns with your abilities and goals.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Optimize Performance:</span> Choose a course where you can excel and achieve your potential.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Reduce Stress:</span> Avoid the frustration of being in a course that doesn't match your learning style.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">University Preparation:</span> Ensure your mathematics course supports your university application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onStart}
              className="inline-flex items-center px-8 py-4 border-0 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Questionnaire
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <p className="mt-3 text-sm text-gray-500">Takes approximately 5 minutes to complete</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-full px-4 py-1 mb-3">
            STUDENT PERSPECTIVES
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            From IB Students Worldwide
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Hear from IB students about how choosing the right mathematics
            course contributed to their academic success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <UserCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Miguel</h4>
                <p className="text-sm text-gray-500">IB Graduate, AA HL</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Choosing AA HL aligned perfectly with my goal to study Engineering. The course challenged me in the right ways and prepared me for university applications."
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Sophia</h4>
                <p className="text-sm text-gray-500">IB Graduate, AI HL</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "As someone interested in Economics, AI HL was the perfect fit. I loved the focus on statistics and modeling real-world scenarios with mathematics."
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <UserCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Lucas</h4>
                <p className="text-sm text-gray-500">IB Graduate, AA SL</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "I wasn't sure which math course to take until I did this assessment. AA SL gave me the right balance of challenge without overwhelming me, while fulfilling my university requirements."
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-10 text-white text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ready to find your perfect IB Mathematics course?</h2>
        <p className="max-w-2xl mx-auto mb-8 opacity-90">
          Take 5 minutes now to complete our assessment and receive your personalized recommendation
          backed by IB mathematics expertise.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
        >
          Start Questionnaire
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 mb-4">
        <p>© {new Date().getFullYear()} IBMathsChoice. All rights reserved.</p>
        <p className="mt-1">A tool for IB Mathematics course selection guidance. Not affiliated with the International Baccalaureate Organization.</p>
      </div>
    </div>
  );
}

export default Welcome;