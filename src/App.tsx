import React, { useState, useEffect } from 'react';
import { SchoolAuthProvider } from './services/SchoolAuthContext';
import { SchoolThemeProvider } from './services/SchoolThemeProvider';
import SchoolPortal from './components/SchoolPortal';
import { BookOpen, BrainCircuit, Calculator, BarChart as ChartBar, LockKeyhole, School, Globe } from 'lucide-react';
import QuestionnaireForm from './components/QuestionnaireForm';
import StudentInfo from './components/StudentInfo';
import Results from './components/Results';
import Welcome from './components/Welcome';
import SampleProblems from './components/SampleProblems';
import StaffLogin from './components/StaffLogin';
import AdminDashboard from './components/AdminDashboard';
import EarlyAccessGateway from './components/EarlyAccessGateway';
import { login, logout, getCurrentUser, User } from './services/auth';
import { addStudentRecord } from './services/students';

type AppView = 'welcome' | 'student-info' | 'questionnaire' | 'sample' | 'results' | 'login' | 'admin';

function App() {
  // Use SchoolPortal for the multi-tier authentication
  const [useSchoolPortal, setUseSchoolPortal] = useState(true);
  
  // If using SchoolPortal, don't show the regular app
  if (useSchoolPortal) {
    return (
      <SchoolAuthProvider>
        <SchoolThemeProvider>
          <SchoolPortal />
        </SchoolThemeProvider>
      </SchoolAuthProvider>
    );
  }
  
  // Main application state
  const [view, setView] = useState<AppView>('welcome');
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [sampleAnswers, setSampleAnswers] = useState<Record<string, string>>({});
  
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [hasEarlyAccess, setHasEarlyAccess] = useState<boolean>(false);

  // Student information (if available)
  const [studentInfo, setStudentInfo] = useState<{name: string; email: string;} | null>(null);

  // Check initial access and authentication
  useEffect(() => {
    // Check previous Early Access program access
    const earlyAccess = localStorage.getItem('ibmaths_early_access');
    if (earlyAccess === 'granted') {
      setHasEarlyAccess(true);
    }

    // Check authentication
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      if (view === 'login') {
        setView('admin');
      }
    }
  }, []);

  // Questionnaire handlers
  const handleStart = () => {
    setView('student-info');
  };

  const handleStudentInfoSubmit = (name: string) => {
    // Save student name for later use
    setStudentInfo({ name, email: 'student@stpauls.school' });
    setView('questionnaire');
  };

  const handleQuestionnaireSubmit = (responses: Record<string, string[]>) => {
    setAnswers(responses);
    setView('sample');
  };

  const handleSampleComplete = (responses: Record<string, string>) => {
    setSampleAnswers(responses);
    setView('results');
  };

  const handleSampleSkip = () => {
    setView('results');
  };

  const handleReset = () => {
    setAnswers({});
    setSampleAnswers({});
    setStudentInfo(null);
    setView('welcome');
  };

  // Administration handlers
  const handleLoginClick = () => {
    setView('login');
  };

  const handleLoginSubmit = async (username: string, password: string) => {
    setLoginError(null);
    try {
      const user = await login(username, password);
      if (user) {
        setUser(user);
        setView('admin');
      } else {
        setLoginError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('welcome');
  };

  // Early Access handler
  const handleEarlyAccessGranted = () => {
    setHasEarlyAccess(true);
  };

  // Results saving handler
  const handleSaveResults = (name: string, email: string, course: string, confidence: number) => {
    // Convert multi-select answers to string format for storage compatibility
    const stringifiedAnswers = Object.entries(answers).reduce((acc, [key, values]) => {
      acc[key] = values.join(',');
      return acc;
    }, {} as Record<string, string>);
    
    // Register the result in the local "database"
    addStudentRecord(name, email, course, confidence, stringifiedAnswers);
    
    // Save student information in state
    setStudentInfo({ name, email });
  };

  // If no access, show Early Access page
  if (!hasEarlyAccess) {
    return <EarlyAccessGateway onAccessGranted={handleEarlyAccessGranted} />;
  }

  // Determine which view to show
  const renderView = () => {
    switch (view) {
      case 'welcome':
        return <Welcome onStart={handleStart} />;
      case 'student-info':
        return <StudentInfo onSubmit={handleStudentInfoSubmit} />;
      case 'questionnaire':
        return <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />;
      case 'sample':
        return <SampleProblems onComplete={handleSampleComplete} onSkip={handleSampleSkip} />;
      case 'results':
        return (
          <Results 
            answers={answers} 
            sampleAnswers={sampleAnswers}
            onReset={handleReset}
            onSaveResults={handleSaveResults}
            studentInfo={studentInfo}
          />
        );
      case 'login':
        return <StaffLogin onLogin={handleLoginSubmit} loginError={loginError} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return <Welcome onStart={handleStart} />;
    }
  };

  // Não mostrar o layout normal para admin/login
  if (view === 'login' || view === 'admin') {
    return renderView();
  }

  return (
    <SchoolAuthProvider>
    <SchoolThemeProvider>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <School className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">IBMathsChoice</h1>
              <p className="text-xs text-indigo-600 font-medium">IB Mathematics Course Advisor</p>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            {view !== 'welcome' && (
              <button
                onClick={handleReset}
                className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                Start Over
              </button>
            )}

            {/* Staff Login Button */}
            <button
              onClick={handleLoginClick}
              className="flex items-center text-gray-700 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
            >
              <LockKeyhole className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">School Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderView()}
      </main>

      <footer className="bg-gradient-to-b from-white to-gray-50 mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between pb-8 mb-8 border-b border-gray-200">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">IBMathsChoice</h3>
                <p className="text-xs text-gray-500">Helping IB students worldwide</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:flex md:space-x-8 gap-4">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-gray-700 text-sm">Analysis & Approaches</span>
              </div>
              <div className="flex items-center">
                <ChartBar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700 text-sm">Applications & Interpretation</span>
              </div>
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-gray-700 text-sm">Standard & Higher Level</span>
              </div>
              <div className="flex items-center">
                <BrainCircuit className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700 text-sm">Personalized Guidance</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">&copy; {new Date().getFullYear()} IBMathsChoice. All rights reserved.</p>
            <div className="flex space-x-6">
              <button onClick={handleLoginClick} className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                School Admin
              </button>
              <a href="#about" className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </SchoolThemeProvider>
    </SchoolAuthProvider>
  );
}

export default App;