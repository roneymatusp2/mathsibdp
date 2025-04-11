import React, { useState, useEffect } from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import { useSchoolTheme } from '../services/SchoolThemeProvider';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  ChevronDown, 
  LogOut, 
  School, 
  UserCog,
  PieChart,
  Settings,
  Table,
  FilePlus2,
  RefreshCw,
  Calendar,
  EyeIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { getStudentsBySchool } from '../services/schoolAuth';

// Mock data for the dashboard
const mockTestResults = [
  {
    id: 1,
    student: 'Emma Thompson',
    date: '2023-05-15',
    result: 'Analysis & Approaches HL',
    confidence: 'High',
    score: 86
  },
  {
    id: 2,
    student: 'Alexander Lee',
    date: '2023-05-14',
    result: 'Applications & Interpretation SL',
    confidence: 'Medium',
    score: 72
  },
  {
    id: 3,
    student: 'Sophia Rodriguez',
    date: '2023-05-12',
    result: 'Analysis & Approaches SL',
    confidence: 'High',
    score: 78
  },
  {
    id: 4,
    student: 'James Wilson',
    date: '2023-05-12',
    result: 'Applications & Interpretation HL',
    confidence: 'Medium',
    score: 65
  },
  {
    id: 5,
    student: 'Olivia Parker',
    date: '2023-05-11',
    result: 'Analysis & Approaches HL',
    confidence: 'Very High',
    score: 92
  },
  {
    id: 6,
    student: 'William Chen',
    date: '2023-05-10',
    result: 'Applications & Interpretation SL',
    confidence: 'Low',
    score: 58
  },
  {
    id: 7,
    student: 'Ava Martinez',
    date: '2023-05-10',
    result: 'Analysis & Approaches SL',
    confidence: 'Medium',
    score: 75
  },
  {
    id: 8,
    student: 'Benjamin Kim',
    date: '2023-05-09',
    result: 'Applications & Interpretation HL',
    confidence: 'High',
    score: 81
  }
];

// Distribution data for charts
const recommendationDistribution = [
  { name: 'AA HL', value: 35, color: '#4F46E5' },
  { name: 'AA SL', value: 25, color: '#818CF8' },
  { name: 'AI HL', value: 15, color: '#10B981' },
  { name: 'AI SL', value: 25, color: '#34D399' }
];

const confidenceLevels = [
  { name: 'Very High', value: 20, color: '#047857' },
  { name: 'High', value: 40, color: '#10B981' },
  { name: 'Medium', value: 25, color: '#FBBF24' },
  { name: 'Low', value: 10, color: '#F97316' },
  { name: 'Very Low', value: 5, color: '#EF4444' }
];

const SchoolAdminDashboard: React.FC = () => {
  const { currentSchool, currentUser, logout } = useSchoolAuth();
  const { primaryColor, secondaryColor } = useSchoolTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  
  useEffect(() => {
    const fetchStudents = async () => {
      if (currentSchool) {
        try {
          const studentsData = await getStudentsBySchool(currentSchool.id);
          setStudents(studentsData);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchStudents();
  }, [currentSchool]);
  
  // Filter test results based on search term and filters
  const filteredResults = mockTestResults.filter(result => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      result.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.result.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Date filter
    const today = new Date();
    const resultDate = new Date(result.date);
    let matchesDate = true;
    
    if (dateFilter === 'today') {
      matchesDate = resultDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      matchesDate = resultDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDate = resultDate >= monthAgo;
    }
    
    // Course filter
    let matchesCourse = true;
    if (courseFilter !== 'all') {
      matchesCourse = result.result.includes(courseFilter);
    }
    
    return matchesSearch && matchesDate && matchesCourse;
  });
  
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
  
  if (!currentSchool || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800">Not authenticated</h2>
          <p className="text-gray-600 mt-2">Please login to access the dashboard</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {currentSchool.logo_url ? (
                <img src={currentSchool.logo_url} alt={currentSchool.name} className="h-10 w-auto mr-3" />
              ) : (
                <div 
                  className="h-10 w-10 rounded-md flex items-center justify-center mr-3 text-white"
                  style={{ backgroundColor: primaryColor || '#4F46E5' }}
                >
                  <School className="h-6 w-6" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{currentSchool.name} Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {currentUser.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser.role === 'admin' ? 'Administrator' : 'Teacher'}</div>
                <div className="text-xs text-gray-500">{currentUser.email}</div>
              </div>
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex flex-col space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tabs */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-1 flex"
            variants={itemVariants}
          >
            <button
              className={`flex items-center px-4 py-2.5 rounded-lg ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className={`h-5 w-5 mr-2 ${activeTab === 'overview' ? 'text-indigo-500' : 'text-gray-400'}`} />
              Overview
            </button>
            <button
              className={`flex items-center px-4 py-2.5 rounded-lg ${activeTab === 'students' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('students')}
            >
              <Users className={`h-5 w-5 mr-2 ${activeTab === 'students' ? 'text-indigo-500' : 'text-gray-400'}`} />
              Students
            </button>
            <button
              className={`flex items-center px-4 py-2.5 rounded-lg ${activeTab === 'results' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('results')}
            >
              <FileText className={`h-5 w-5 mr-2 ${activeTab === 'results' ? 'text-indigo-500' : 'text-gray-400'}`} />
              Results
            </button>
            <button
              className={`flex items-center px-4 py-2.5 rounded-lg ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('reports')}
            >
              <FileSpreadsheet className={`h-5 w-5 mr-2 ${activeTab === 'reports' ? 'text-indigo-500' : 'text-gray-400'}`} />
              Reports
            </button>
            <button
              className={`flex items-center px-4 py-2.5 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className={`h-5 w-5 mr-2 ${activeTab === 'settings' ? 'text-indigo-500' : 'text-gray-400'}`} />
              Settings
            </button>
          </motion.div>
          
          {/* Overview Dashboard */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={itemVariants}
              >
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Users className="h-6 w-6" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Total Students</div>
                      <div className="text-2xl font-bold text-gray-900">137</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-500 text-xs font-medium flex items-center mr-2">
                      <ChevronDown className="h-3 w-3 transform rotate-180" />
                      12%
                    </span>
                    <span className="text-xs text-gray-500">from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <FileText className="h-6 w-6" style={{ color: secondaryColor }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Assessments</div>
                      <div className="text-2xl font-bold text-gray-900">94</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-500 text-xs font-medium flex items-center mr-2">
                      <ChevronDown className="h-3 w-3 transform rotate-180" />
                      8%
                    </span>
                    <span className="text-xs text-gray-500">from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-green-100"
                    >
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">This Week</div>
                      <div className="text-2xl font-bold text-gray-900">23</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-500 text-xs font-medium flex items-center mr-2">
                      <ChevronDown className="h-3 w-3 transform rotate-180" />
                      16%
                    </span>
                    <span className="text-xs text-gray-500">from last week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-100"
                    >
                      <PieChart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Completion Rate</div>
                      <div className="text-2xl font-bold text-gray-900">92%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-500 text-xs font-medium flex items-center mr-2">
                      <ChevronDown className="h-3 w-3 transform rotate-180" />
                      3%
                    </span>
                    <span className="text-xs text-gray-500">from last month</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Charts Section */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={itemVariants}
              >
                {/* Course Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Course Recommendations</h3>
                    <div className="flex space-x-2">
                      <button className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">This Year</button>
                      <button className="text-xs px-2 py-1 text-gray-500 rounded-md hover:bg-gray-50">All Time</button>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/2">
                      {/* Simple SVG Donut Chart */}
                      <svg width="100%" height="200" viewBox="0 0 120 120" className="mx-auto">
                        <circle cx="60" cy="60" r="50" fill="transparent" stroke="#E5E7EB" strokeWidth="15" />
                        
                        {/* Calculate and draw arcs for each segment */}
                        {(() => {
                          const total = recommendationDistribution.reduce((sum, item) => sum + item.value, 0);
                          let angleOffset = -90; // Start from top
                          
                          return recommendationDistribution.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const angle = 3.6 * percentage; // 3.6 = 360 / 100
                            
                            // SVG Arc calculation
                            const startAngle = angleOffset * (Math.PI / 180);
                            const endAngle = (angleOffset + angle) * (Math.PI / 180);
                            
                            const x1 = 60 + 50 * Math.cos(startAngle);
                            const y1 = 60 + 50 * Math.sin(startAngle);
                            const x2 = 60 + 50 * Math.cos(endAngle);
                            const y2 = 60 + 50 * Math.sin(endAngle);
                            
                            // Determine if it's a large arc (> 180 degrees)
                            const largeArcFlag = angle > 180 ? 1 : 0;
                            
                            // Create SVG path
                            const pathData = `M ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`;
                            
                            // Update angle offset for next segment
                            angleOffset += angle;
                            
                            return (
                              <path 
                                key={index} 
                                d={pathData} 
                                fill="transparent" 
                                stroke={item.color} 
                                strokeWidth="15" 
                              />
                            );
                          });
                        })()}
                        
                        {/* Donut hole */}
                        <circle cx="60" cy="60" r="40" fill="white" />
                        
                        {/* Center text */}
                        <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold" fill="#1F2937">
                          {recommendationDistribution.reduce((sum, item) => sum + item.value, 0)}
                        </text>
                        <text x="60" y="72" textAnchor="middle" dominantBaseline="middle" className="text-xs" fill="#6B7280">
                          students
                        </text>
                      </svg>
                    </div>
                    
                    <div className="w-1/2 flex flex-col justify-center">
                      <div className="space-y-4">
                        {recommendationDistribution.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="text-sm text-gray-600">{item.name}</div>
                            <div className="ml-auto font-medium text-gray-900">{item.value}</div>
                            <div className="ml-2 text-xs text-gray-500">
                              {Math.round((item.value / recommendationDistribution.reduce((sum, i) => sum + i.value, 0)) * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Confidence Levels */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Recommendation Confidence</h3>
                    <div className="flex space-x-2">
                      <button className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">This Year</button>
                      <button className="text-xs px-2 py-1 text-gray-500 rounded-md hover:bg-gray-50">All Time</button>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    {confidenceLevels.map((level, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-600">{level.name}</div>
                          <div className="text-sm font-medium text-gray-900">{level.value}%</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ width: `${level.value}%`, backgroundColor: level.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Recent Results */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Recent Results</h3>
                    <button 
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                      onClick={() => setActiveTab('results')}
                    >
                      View All
                      <ChevronDown className="ml-1 h-4 w-4 transform -rotate-90" />
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockTestResults.slice(0, 5).map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.student}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  result.result.includes('Analysis') 
                                    ? 'bg-indigo-100 text-indigo-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {result.result}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  result.confidence === 'High' || result.confidence === 'Very High'
                                    ? 'bg-green-100 text-green-800'
                                    : result.confidence === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {result.confidence}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{result.score}%</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <EyeIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={itemVariants}
              >
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <FilePlus2 className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-900">Generate Report</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Create a comprehensive report of all student assessments and results.</p>
                  <button 
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    onClick={() => setActiveTab('reports')}
                  >
                    Generate Report
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <RefreshCw className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-900">Update Student List</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Sync your student roster and manage student accounts.</p>
                  <button 
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    onClick={() => setActiveTab('students')}
                  >
                    Manage Students
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-900">Schedule Tests</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Create scheduled assessment sessions for your students.</p>
                  <button 
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Create Schedule
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students or results..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                      >
                        <Filter className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Filters</span>
                        <ChevronDown className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
                      </button>
                      
                      {showFilters && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                            <select
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              value={dateFilter}
                              onChange={(e) => setDateFilter(e.target.value)}
                            >
                              <option value="all">All Time</option>
                              <option value="today">Today</option>
                              <option value="week">This Week</option>
                              <option value="month">This Month</option>
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                            <select
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              value={courseFilter}
                              onChange={(e) => setCourseFilter(e.target.value)}
                            >
                              <option value="all">All Courses</option>
                              <option value="Analysis & Approaches HL">AA HL</option>
                              <option value="Analysis & Approaches SL">AA SL</option>
                              <option value="Applications & Interpretation HL">AI HL</option>
                              <option value="Applications & Interpretation SL">AI SL</option>
                            </select>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setDateFilter('all');
                                setCourseFilter('all');
                              }}
                              className="mr-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Results Table */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                                  {result.student.charAt(0)}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{result.student}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  result.result.includes('Analysis') 
                                    ? 'bg-indigo-100 text-indigo-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {result.result}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  result.confidence === 'High' || result.confidence === 'Very High'
                                    ? 'bg-green-100 text-green-800'
                                    : result.confidence === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {result.confidence}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.score}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Download className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                            No results found. Try adjusting your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SchoolAdminDashboard; 