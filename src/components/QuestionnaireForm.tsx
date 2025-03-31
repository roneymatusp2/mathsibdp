import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, BrainCircuit, Calculator, School, GraduationCap, AlertCircle, Info } from 'lucide-react';
import { questions } from '../data/questions';

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, string[]>) => void;
}

function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showValidation, setShowValidation] = useState(false);

  const sections = [
    { 
      title: 'Career & Future Path',
      icon: GraduationCap,
      description: 'Let\'s start by understanding your academic and career aspirations',
      questions: questions.slice(0, 5),
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      title: 'Interest & Enjoyment',
      icon: BookOpen,
      description: 'Tell us about your relationship with mathematics',
      questions: questions.slice(5, 10),
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Skills & Confidence',
      icon: Calculator,
      description: 'Assess your mathematical abilities and comfort level',
      questions: questions.slice(10, 15),
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      title: 'Learning Style',
      icon: BrainCircuit,
      description: 'How do you prefer to learn and engage with mathematics?',
      questions: questions.slice(15, 20),
      color: 'from-orange-500 to-amber-500'
    },
    { 
      title: 'Future Goals',
      icon: School,
      description: 'Your aspirations and plans for higher education',
      questions: questions.slice(20, 25),
      color: 'from-rose-500 to-pink-500'
    }
  ];

  const handleAnswerToggle = (questionId: string, value: string) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      // If already selected, remove it
      if (currentAnswers.includes(value)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(v => v !== value)
        };
      }
      
      // If adding would exceed 2 selections, remove the oldest one
      if (currentAnswers.length >= 2) {
        return {
          ...prev,
          [questionId]: [...currentAnswers.slice(1), value]
        };
      }
      
      // Otherwise, add the new selection
      return {
        ...prev,
        [questionId]: [...currentAnswers, value]
      };
    });
    
    setShowValidation(false);
  };

  const currentQuestions = sections[currentSection].questions;
  
  // A question is considered answered if it has at least one selection
  const isCurrentSectionComplete = currentQuestions.every(q => 
    answers[q.id] && answers[q.id].length > 0
  );
  
  const isLastSection = currentSection === sections.length - 1;
  const isFirstSection = currentSection === 0;

  // Calculate total progress - count questions that have at least one answer
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).filter(key => 
    answers[key] && answers[key].length > 0
  ).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  // Check if all questions have at least one answer
  const isFormComplete = useMemo(() => {
    return questions.every(q => answers[q.id] && answers[q.id].length > 0);
  }, [answers]);

  const handleNext = () => {
    if (isLastSection) {
      if (!isFormComplete) {
        setShowValidation(true);
        return;
      }
      onSubmit(answers);
    } else {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
  };

  const CurrentIcon = sections[currentSection].icon;

  // Get unanswered sections
  const unansweredSections = sections.map((section, index) => {
    const unansweredQuestions = section.questions.filter(q => 
      !answers[q.id] || answers[q.id].length === 0
    );
    return {
      index,
      title: section.title,
      count: unansweredQuestions.length
    };
  }).filter(section => section.count > 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <CurrentIcon className="h-8 w-8 text-school-navy" />
            <div>
              <h2 className="text-2xl font-bold text-school-navy">
                {sections[currentSection].title}
              </h2>
              <p className="text-school-navy/70">
                {sections[currentSection].description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-school-navy/70 font-medium block">
              Section {currentSection + 1} of {sections.length}
            </span>
            <span className="text-school-navy/60 text-sm">
              {answeredQuestions} of {totalQuestions} questions answered
            </span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex space-x-2 mb-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isComplete = section.questions.every(q => 
              answers[q.id] && answers[q.id].length > 0
            );
            return (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  currentSection === index 
                    ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-lg scale-105' 
                    : isComplete
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden md:inline">
                    {section.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 transition-all duration-300 bg-gradient-to-r ${sections[currentSection].color}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Selection Instructions */}
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Multiple Selection Allowed
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>You can select up to 2 options for each question. Select the options that best represent your preferences.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {showValidation && !isFormComplete && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please complete all questions before submitting
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">Sections with unanswered questions:</p>
                  <ul className="mt-1 list-disc list-inside">
                    {unansweredSections.map(section => (
                      <li key={section.index}>
                        {section.title} ({section.count} question{section.count > 1 ? 's' : ''} remaining)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((question, qIndex) => (
          <div 
            key={question.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
          >
            <div className={`h-1 bg-gradient-to-r ${sections[currentSection].color}`} />
            <div className="p-6">
              <p className="text-lg font-medium text-school-navy mb-4">
                {qIndex + 1}. {question.text}
              </p>
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = answers[question.id]?.includes(option.value) || false;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${isSelected
                          ? `border-transparent bg-gradient-to-r ${sections[currentSection].color} text-white` 
                          : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                    >
                      <input
                        type="checkbox"
                        name={question.id}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleAnswerToggle(question.id, option.value)}
                        className="h-4 w-4 text-white border-white focus:ring-offset-0 focus:ring-0"
                      />
                      <span className="ml-3">{option.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Selected: {answers[question.id]?.length || 0}/2 options
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        {!isFirstSection && (
          <button
            onClick={handlePrevious}
            className="inline-flex items-center px-6 py-3 border-2 border-school-navy text-base font-medium rounded-lg text-school-navy hover:bg-school-navy/5 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous Section
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={handleNext}
          disabled={!isCurrentSectionComplete}
          className={`inline-flex items-center px-6 py-3 border-2 text-base font-medium rounded-lg transition-all
            ${isCurrentSectionComplete
              ? `bg-gradient-to-r ${sections[currentSection].color} text-white border-transparent hover:opacity-90`
              : 'border-gray-300 bg-gray-300 text-white cursor-not-allowed'
            }`}
        >
          {isLastSection ? (
            <>
              Submit Questionnaire
              <CheckCircle className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Next Section
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuestionnaireForm;