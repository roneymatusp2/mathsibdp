import React, { useState, useEffect } from 'react';
import { useSchoolAuth } from '../services/SchoolAuthContext';
import SchoolLogin from './SchoolLogin';
import SchoolRegistration from './SchoolRegistration';
import SchoolWelcome from './SchoolWelcome';
import SchoolUserLogin from './SchoolUserLogin';
import SchoolStudentRegistration from './SchoolStudentRegistration';
import AdminDashboard from './AdminDashboard';
import QuestionnaireForm from './QuestionnaireForm';
import Results from './Results';
import SampleProblems from './SampleProblems';

type SchoolPortalView = 
  | 'school-login'
  | 'school-registration'
  | 'school-welcome' 
  | 'teacher-login' 
  | 'student-login'
  | 'student-register'
  | 'teacher-dashboard'
  | 'questionnaire'
  | 'sample-problems'
  | 'results';

const SchoolPortal: React.FC = () => {
  const { 
    currentSchool, 
    currentUser, 
    setCurrentSchool, 
    setCurrentUser 
  } = useSchoolAuth();
  
  const [view, setView] = useState<SchoolPortalView>('school-login');
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [sampleAnswers, setSampleAnswers] = useState<Record<string, string>>({});
  
  // Reset the view when the school or user authentication changes
  useEffect(() => {
    if (!currentSchool) {
      setView('school-login');
      return;
    }
    
    if (!currentUser) {
      setView('school-welcome');
      return;
    }
    
    // Set the appropriate view based on user role
    if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
      setView('teacher-dashboard');
    } else if (currentUser.role === 'student') {
      setView('questionnaire');
    }
  }, [currentSchool, currentUser]);
  
  // Handle school login
  const handleSchoolLogin = (school: any) => {
    setCurrentSchool(school);
    setView('school-welcome');
  };
  
  // Toggle between login and registration
  const handleShowRegistration = () => setView('school-registration');
  const handleShowLogin = () => setView('school-login');
  
  // Handle school registration
  const handleSchoolRegistration = (school: any) => {
    setCurrentSchool(school);
    setView('school-welcome');
  };
  
  // Handle user login
  const handleUserLogin = (user: any) => {
    setCurrentUser(user);
    if (user.role === 'teacher' || user.role === 'admin') {
      setView('teacher-dashboard');
    } else {
      setView('questionnaire');
    }
  };
  
  // Handle navigation from school welcome screen
  const handleTeacherLogin = () => setView('teacher-login');
  const handleStudentLogin = () => setView('student-login');
  const handleStudentRegister = () => setView('student-register');
  
  // Handle back navigation
  const handleBackToSchoolWelcome = () => setView('school-welcome');
  
  // Handle questionnaire flow
  const handleQuestionnaireSubmit = (responses: Record<string, string[]>) => {
    setAnswers(responses);
    setView('sample-problems');
  };
  
  const handleSampleComplete = (responses: Record<string, string>) => {
    setSampleAnswers(responses);
    setView('results');
  };
  
  const handleSampleSkip = () => {
    setView('results');
  };
  
  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setView('school-welcome');
  };
  
  // Complete logout (school and user)
  const handleCompleteLogout = () => {
    setCurrentUser(null);
    setCurrentSchool(null);
    setView('school-login');
  };
  
  // Determine which component to render based on the current view
  const renderView = () => {
    switch (view) {
      case 'school-login':
        return <SchoolLogin onSchoolLogin={handleSchoolLogin} onRegister={handleShowRegistration} />;
        
      case 'school-registration':
        return <SchoolRegistration onRegistrationComplete={handleSchoolRegistration} onBack={handleShowLogin} />;
        
      case 'school-welcome':
        return (
          <SchoolWelcome 
            onTeacherLogin={handleTeacherLogin}
            onStudentLogin={handleStudentLogin}
            onStudentRegister={handleStudentRegister}
          />
        );
        
      case 'teacher-login':
        return (
          <SchoolUserLogin 
            userType="teacher" 
            onBack={handleBackToSchoolWelcome} 
            onLogin={handleUserLogin}
          />
        );
        
      case 'student-login':
        return (
          <SchoolUserLogin 
            userType="student" 
            onBack={handleBackToSchoolWelcome} 
            onLogin={handleUserLogin}
          />
        );
        
      case 'student-register':
        return (
          <SchoolStudentRegistration
            onBack={handleBackToSchoolWelcome}
            onRegisterSuccess={handleUserLogin}
          />
        );
        
      case 'teacher-dashboard':
        return (
          <AdminDashboard 
            onLogout={handleLogout} 
            onCompleteLogout={handleCompleteLogout}
          />
        );
        
      case 'questionnaire':
        return (
          <QuestionnaireForm 
            onSubmit={handleQuestionnaireSubmit} 
            onLogout={handleLogout}
            onCompleteLogout={handleCompleteLogout}
          />
        );
        
      case 'sample-problems':
        return (
          <SampleProblems 
            onComplete={handleSampleComplete} 
            onSkip={handleSampleSkip}
            onLogout={handleLogout}
            onCompleteLogout={handleCompleteLogout}
          />
        );
        
      case 'results':
        return (
          <Results 
            answers={answers}
            sampleAnswers={sampleAnswers}
            onReset={() => setView('questionnaire')}
            onLogout={handleLogout}
            onCompleteLogout={handleCompleteLogout}
            studentInfo={currentUser ? { 
              name: currentUser.name, 
              email: currentUser.email || ''
            } : null}
          />
        );
        
      default:
        return <SchoolLogin onSchoolLogin={handleSchoolLogin} />;
    }
  };
  
  return (
    <div className="min-h-screen">
      {renderView()}
    </div>
  );
};

export default SchoolPortal;
