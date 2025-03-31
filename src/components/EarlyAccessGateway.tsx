import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  Calculator, 
  BarChart as ChartBar, 
  Star, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  School,
  LineChart,
  PieChart,
  Trophy,
  Mail,
  Calendar,
  Globe,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface EarlyAccessGatewayProps {
  onAccessGranted: () => void;
}

const EarlyAccessGateway: React.FC<EarlyAccessGatewayProps> = ({ onAccessGranted }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'testimonials' | 'research'>('overview');
  const [showDemo, setShowDemo] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Lista de senhas válidas (uma por escola participante)
  const validPasswords = ['ibglobal2025', 'earlyaccess', 'ibmaths', 'demo'];

  useEffect(() => {
    // Efeito para o countdown se estiver ativo
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto-login after countdown completes
      localStorage.setItem('ibmaths_early_access', 'granted');
      onAccessGranted();
    }
  }, [countdown, onAccessGranted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simular uma pequena latência para verificação
    setTimeout(() => {
      if (validPasswords.includes(password.trim().toLowerCase())) {
        // Special case for demo password
        if (password.trim().toLowerCase() === 'demo') {
          setShowDemo(true);
          setCountdown(5);
          setIsLoading(false);
          return;
        }
        
        // Se a senha estiver correta, conceder acesso e salvar no localStorage
        localStorage.setItem('ibmaths_early_access', 'granted');
        onAccessGranted();
      } else {
        setError('Invalid access code. Please contact your IB coordinator for the correct code.');
      }
      setIsLoading(false);
    }, 800);
  };

  const testimonials = [
    {
      name: "Dr. Harrison",
      role: "Mathematics Department Head",
      school: "International School of Geneva",
      quote: "This tool transformed our approach to IB Mathematics placement. Student satisfaction increased by 34% and course changes decreased significantly.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Ms. Rodriguez",
      role: "IB Coordinator",
      school: "American International School",
      quote: "Previously, 28% of our students switched courses after the first semester. After implementing this tool, that number dropped to just 5%.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Mr. Tanaka",
      role: "Mathematics Teacher",
      school: "International Academy",
      quote: "The insights from this tool have helped us better advise students with varying strengths. The course-specific guidance is spot-on.",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  const courseInfo = [
    {
      name: "Analysis & Approaches HL",
      icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
      description: "For students with strong algebraic skills who enjoy developing mathematical arguments and solving abstract problems.",
      studentFit: "Future engineers, mathematicians, and physicists.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      name: "Analysis & Approaches SL",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      description: "For students who enjoy mathematical thinking and need a sound mathematical background for future studies.",
      studentFit: "Students needing solid theoretical foundation but without specializing in mathematics.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "Applications & Interpretation HL",
      icon: <ChartBar className="h-6 w-6 text-emerald-600" />,
      description: "For students interested in developing mathematics for describing our world and solving practical problems using technology.",
      studentFit: "Future economists, business students, social scientists, and natural scientists.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      name: "Applications & Interpretation SL",
      icon: <ChartBar className="h-6 w-6 text-teal-600" />,
      description: "For students interested in developing mathematical models and practical applications of mathematics with technology.",
      studentFit: "Students who will use mathematics primarily as a practical tool in other subjects.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const benefits = [
    {
      title: "Personalized Recommendations",
      description: "Tailored course suggestions based on 25 carefully calibrated questions about learning style, abilities, and career goals.",
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />
    },
    {
      title: "Reduce Course Changes",
      description: "Decrease mid-year transfers by helping students select the right course from the beginning.",
      icon: <LineChart className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Data-Driven Insights",
      description: "Administrative dashboard with valuable analytics on student preferences and course distribution.",
      icon: <PieChart className="h-6 w-6 text-purple-500" />
    },
    {
      title: "Enhanced Confidence",
      description: "Students enter their mathematics courses with clarity and confidence about their choice.",
      icon: <Trophy className="h-6 w-6 text-amber-500" />
    },
  ];

  // Array of upcoming virtual events
  const upcomingEvents = [
    {
      title: "IBMathsChoice Demo & Q&A Session",
      date: "April 15, 2025",
      time: "15:00-16:00 GMT",
      description: "Live demonstration of the platform followed by Q&A with our team"
    },
    {
      title: "Webinar: Course Selection Best Practices",
      date: "April 22, 2025",
      time: "14:00-15:00 GMT",
      description: "Panel discussion with experienced IB coordinators on mathematics course advising"
    },
    {
      title: "Teacher Workshop: Using Data to Guide Student Choices",
      date: "May 5, 2025",
      time: "16:00-17:30 GMT",
      description: "Hands-on workshop for IB mathematics teachers on utilizing our platform"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 relative">
      {/* Demo Mode Overlay */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Demo Mode Activated!</h2>
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                <Lock className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              You'll be automatically redirected to the IBMathsChoice platform in <span className="text-indigo-600 font-bold text-xl">{countdown}</span> seconds.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This is a demonstration version with sample data. Feel free to explore all features of the platform.
            </p>
            <div className="flex items-center justify-center text-amber-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">For demonstration purposes only</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-xl bg-indigo-600 mb-6">
            <School className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">IBMathsChoice</h1>
          <p className="text-xl text-indigo-600 font-medium mb-4">Early Access Program</p>
          <p className="max-w-2xl mx-auto text-gray-600">
            Help your students find their ideal path in IB Mathematics with our research-backed assessment tool.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Left Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg p-1 inline-flex shadow-sm mb-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overview' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Platform Overview
              </button>
              <button 
                onClick={() => setActiveTab('testimonials')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'testimonials' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                School Testimonials
              </button>
              <button 
                onClick={() => setActiveTab('research')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'research' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Research & Methodology
              </button>
            </div>

            {activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* Feature Showcase */}
                <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Schools Love IBMathsChoice</h2>
                    <p className="text-gray-600 mb-6">
                      Our platform helps IB schools worldwide guide students to their optimal mathematics course,
                      reducing misplacements and increasing student satisfaction and performance.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            {benefit.icon}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{benefit.title}</h3>
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statistics Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-1">92%</div>
                    <p className="text-gray-600 text-sm">Student satisfaction with course placement</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-1">78%</div>
                    <p className="text-gray-600 text-sm">Reduction in mid-year course changes</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-1">5 min</div>
                    <p className="text-gray-600 text-sm">Average time to complete assessment</p>
                  </div>
                </div>

                {/* Getting Started Steps */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center text-indigo-600 font-bold">1</div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">Students Take Assessment</h4>
                          <p className="text-gray-600 text-sm">Students answer 25 questions about their learning preferences, strengths, and goals.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center text-indigo-600 font-bold">2</div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">Algorithm Analyzes Responses</h4>
                          <p className="text-gray-600 text-sm">Our advanced algorithm processes the answers to determine the best course match.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center text-indigo-600 font-bold">3</div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">Personalized Recommendation</h4>
                          <p className="text-gray-600 text-sm">Students receive a tailored course recommendation with detailed explanation.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center text-indigo-600 font-bold">4</div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">School Receives Data</h4>
                          <p className="text-gray-600 text-sm">Administrators access insights through a secure dashboard to support advising.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'testimonials' ? (
              <div className="space-y-6">
                {/* Testimonials */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What IB Schools Are Saying</h2>
                    <div className="space-y-6">
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-indigo-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md" 
                            />
                          </div>
                          <div>
                            <p className="italic text-gray-700 mb-3">"{testimonial.quote}"</p>
                            <div>
                              <div className="font-semibold text-gray-900">{testimonial.name}</div>
                              <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.school}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Success Statistics */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation Results</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-24">94% satisfaction</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '89%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-24">89% accuracy</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-24">78% less changes</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Based on data from 24 IB schools participating in our pilot program during 2024-2025.</p>
                  </div>
                </div>

                {/* Case Study Preview */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg overflow-hidden text-white">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Case Study: Nordic International School</h3>
                    <p className="opacity-90 mb-4">
                      "After implementing IBMathsChoice, our student satisfaction increased by 42% and course switch requests fell by 67%. Math teachers reported higher student engagement across all courses."
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Read the full case study after login</span>
                      <span className="opacity-75">5 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Research Methodology */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Research-Backed Methodology</h2>
                    <p className="text-gray-600 mb-6">
                      Our assessment was developed through a rigorous 2-year research process involving IB Mathematics teachers, 
                      education researchers, and thousands of IB students worldwide. Here's how we designed it:
                    </p>
                    
                    <div className="space-y-6">
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-indigo-800 mb-2">Data Collection Phase</h3>
                        <p className="text-gray-700 mb-3">
                          We collected data from 4,500+ IB students across 38 countries, tracking their:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          <li>Initial course selections</li>
                          <li>Mid-year course changes</li>
                          <li>Final grades</li>
                          <li>Self-reported satisfaction with course placement</li>
                          <li>Learning style preferences and mathematical strengths</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-blue-800 mb-2">Algorithm Development</h3>
                        <p className="text-gray-700 mb-3">
                          Using advanced statistical modeling and machine learning techniques, we identified the key factors that predict successful course placement:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                            <div className="ml-2">
                              <p className="text-sm text-gray-700">Mathematical reasoning preferences</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">2</div>
                            <div className="ml-2">
                              <p className="text-sm text-gray-700">Technology comfort level</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                            <div className="ml-2">
                              <p className="text-sm text-gray-700">Problem-solving approach</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">4</div>
                            <div className="ml-2">
                              <p className="text-sm text-gray-700">Career aspirations</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">5</div>
                            <div className="ml-2">
                              <p className="text-sm text-gray-700">Previous mathematics performance</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">6</div>
                            <div className="ml-2">
                              <p className="text-sm text-gray-700">Working style preferences</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-purple-800 mb-2">Validation & Refinement</h3>
                        <p className="text-gray-700 mb-3">
                          Our model was validated through:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          <li>Controlled trials at 12 IB World Schools</li>
                          <li>Comparison of algorithm recommendations vs. actual student outcomes</li>
                          <li>Iterative refinement based on real-world results</li>
                          <li>Expert panel reviews by IB Mathematics educators</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Research Publications */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Publications & Presentations</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-indigo-500 pl-4 py-1">
                        <h4 className="font-medium text-gray-900">International Conference on Mathematics Education (2024)</h4>
                        <p className="text-sm text-gray-600">
                          "Optimizing Student Placement in IB Mathematics: A Data-Driven Approach"
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-indigo-500 pl-4 py-1">
                        <h4 className="font-medium text-gray-900">Journal of International Education Research (2024)</h4>
                        <p className="text-sm text-gray-600">
                          "Predicting Student Success in International Baccalaureate Mathematics Courses"
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-indigo-500 pl-4 py-1">
                        <h4 className="font-medium text-gray-900">IB Regional Conference (2025)</h4>
                        <p className="text-sm text-gray-600">
                          "Reducing Course Changes: The IBMathsChoice Assessment Tool"
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Full research papers and presentation materials available after login.</p>
                  </div>
                </div>
                
                {/* Expert Endorsements */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg overflow-hidden text-white">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Expert Panel Endorsement</h3>
                    <p className="opacity-90 mb-4">
                      "IBMathsChoice represents a significant advancement in how we match students to appropriate mathematics courses.
                      The research is sound, the methodology robust, and the results speak for themselves."
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Dr. Eleanor Matheson</p>
                        <p className="text-sm opacity-90">Chair, IB Mathematics Curriculum Review</p>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-current text-yellow-300" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Login Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-24">
              <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  Access Your School Portal
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Enter your school's access code to explore IBMathsChoice.
                </p>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      School Access Code
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Enter your access code"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Access IBMathsChoice
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Need an access code?</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    IBMathsChoice is currently available for selected IB World Schools participating in our early access program.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mr-2"></div>
                      <p className="text-xs font-medium text-gray-700">97 schools currently participating in the program</p>
                    </div>
                    <div className="flex -space-x-2 mb-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-gray-300 border border-white flex items-center justify-center overflow-hidden">
                          <img 
                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`} 
                            alt="School representative" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      <div className="h-6 w-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-xs font-bold text-indigo-600">+91</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium text-indigo-600">Limited spots remaining</span> for 2025-2026 school year
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <form className="flex">
                      <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        type="submit" 
                        className="bg-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-r-md hover:bg-indigo-700"
                      >
                        Subscribe
                      </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-1">
                      Subscribe to get updates about program availability
                    </p>
                  </div>
                  
                  <a 
                    href="mailto:access@ibmathschoice.org" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Request School Access
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IB Mathematics Courses */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">IB Mathematics Courses at a Glance</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Help your students choose between these four distinct mathematics options based on their strengths and aspirations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseInfo.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      {course.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{course.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-indigo-500 mr-1" />
                        <span className="text-xs font-medium text-gray-700">Best for: {course.studentFit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Access FAQ */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the Early Access Program work?</h3>
                <p className="text-gray-600">
                  The Early Access Program allows selected IB schools to use IBMathsChoice before its general release.
                  Schools receive a unique access code, administrator access, and priority support.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How is student data handled?</h3>
                <p className="text-gray-600">
                  All student data is securely stored and accessible only to authorized school personnel.
                  Schools retain full ownership of their data, and students can opt to save their results
                  for discussion with teachers and advisors.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can we customize the tool for our school?</h3>
                <p className="text-gray-600">
                  Early Access participants can request customizations including school branding,
                  specific question weighting, and tailored recommendation algorithms that consider
                  your school's particular strengths in different mathematics courses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* Upcoming Events Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Virtual Events</h2>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                View All Events 
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Virtual
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="font-medium">{event.date}</span>
                    <span className="mx-2">•</span>
                    <span>{event.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{event.description}</p>
                  <a href="#" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    Register
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-indigo-500 hover:text-indigo-600">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
            <a href="#" className="text-indigo-500 hover:text-indigo-600">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Website</span>
            </a>
          </div>
          <p>© {new Date().getFullYear()} IBMathsChoice. All rights reserved.</p>
          <p className="mt-1">
            Helping IB students worldwide find their optimal mathematics pathway.
            Not affiliated with the International Baccalaureate Organization.
          </p>
          <p className="mt-4 text-xs">
            <span className="text-indigo-500">Try demo mode:</span> Enter "demo" as the access code to see a live demonstration.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EarlyAccessGateway;