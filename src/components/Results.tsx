import React, { useState } from 'react';
import { calculateResults } from '../utils/scoring';
import { 
  ArrowUpIcon as ArrowPathIcon, 
  BookOpen, 
  BrainCircuit, 
  Calculator, 
  BarChart as ChartBar, 
  Save, 
  Check,
  Mail,
  User
} from 'lucide-react';

interface ResultsProps {
  answers: Record<string, string[]>;
  sampleAnswers: Record<string, string>;
  onReset: () => void;
  onSaveResults?: (name: string, email: string, course: string, confidence: number) => void;
  studentInfo?: {name: string; email: string;} | null;
}

function Results({ 
  answers, 
  sampleAnswers, 
  onReset, 
  onSaveResults, 
  studentInfo 
}: ResultsProps) {
  const results = calculateResults(answers);
  const { course, level, confidence, details } = results;
  
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveResults) {
      onSaveResults(name, email, `${course} ${level}`, confidence);
      setSaveSuccess(true);
      setShowSaveForm(false);
    }
  };

  // Get the total number of selections made across all questions
  const totalSelections = Object.values(answers).reduce((total, selections) => 
    total + selections.length, 0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-school-navy to-school-red"></div>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-school-navy mb-4">
              Your Recommended Course
            </h2>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-school-navy/10 to-school-red/10 text-school-navy text-xl font-semibold">
              {course === 'AA' ? (
                <BookOpen className="h-6 w-6 mr-2 text-school-red" />
              ) : (
                <ChartBar className="h-6 w-6 mr-2 text-school-red" />
              )}
              Mathematics: {course === 'AA' ? 'Analysis & Approaches' : 'Applications & Interpretation'} ({level})
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-school-navy/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-school-navy">
                <Calculator className="h-5 w-5 mr-2 text-school-red" />
                Course Focus
              </h3>
              <p className="text-gray-700">{details.focus}</p>
            </div>

            <div className="bg-school-navy/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-school-navy">
                <BrainCircuit className="h-5 w-5 mr-2 text-school-red" />
                Learning Style Match
              </h3>
              <p className="text-gray-700">{details.style}</p>
            </div>
          </div>

          {Object.keys(sampleAnswers).length > 0 && (
            <div className="bg-school-navy/5 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-3 text-school-navy">Sample Problem Results</h3>
              <p className="text-gray-700">
                You attempted {Object.keys(sampleAnswers).length} sample problems. These problems were designed
                to give you a taste of different mathematical approaches you might encounter in your chosen course.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-school-navy p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-school-navy" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-school-navy">
                  Recommendation Confidence: {confidence}%
                </h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>{details.advice}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">
                  Selection Analysis
                </h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>You made a total of {totalSelections} selections across all {Object.keys(answers).length} questions. Your pattern of selections has helped us better understand your preferences and learning style.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Results Form */}
          {onSaveResults && !studentInfo && !saveSuccess && (
            <div className="mb-8">
              {!showSaveForm ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Would you like to save your results for discussion with counselors?
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowSaveForm(true)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-school-navy hover:bg-school-navy/90"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save Results
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-school-navy mb-4">Save Your Results</h3>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="John Smith"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">School Email</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="john.smith@school.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-school-navy hover:bg-school-navy/90"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSaveForm(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Success message */}
          {(saveSuccess || studentInfo) && (
            <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Results saved successfully for <strong>{studentInfo?.name || name}</strong>. 
                    Your math teacher will discuss these results with you.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 border-2 border-school-red text-base font-medium rounded-md text-white bg-school-red hover:bg-school-red/90"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Take Questionnaire Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;