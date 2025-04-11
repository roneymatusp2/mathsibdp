import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BarChart as ChartBar } from 'lucide-react';
import { Results as ResultsType } from '../../utils/scoring'; // Assuming Results type is exported from scoring

interface AdvancedAnalysisProps {
  results: ResultsType;
  courseInfo: {
    title: string;
    focus: string;
    suitable: string;
    topics: string;
    workload: string;
  };
  totalSelections: number;
  answersCount: number;
}

const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({
  results,
  courseInfo,
  totalSelections,
  answersCount,
}) => {
  const { course, level, confidence } = results;

  return (
    <motion.div
      className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-school-navy">
        Advanced Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Selection Factors */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-school-navy">
            Course Selection Factors
          </h4>
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Course Preference:</span>
              <span className="text-sm font-semibold">
                {results.scores.aaPercent > results.scores.aiPercent
                  ? `Analysis & Approaches (${results.scores.aaPercent.toFixed(1)}%)`
                  : `Applications & Interpretation (${results.scores.aiPercent.toFixed(1)}%)`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-school-navy h-2.5 rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(100, 50 + (results.scores.aaPercent - results.scores.aiPercent) / 2))}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Analysis & Approaches</span>
              <span className="text-xs text-gray-500">
                Applications & Interpretation
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Level Preference:</span>
              <span className="text-sm font-semibold">
                {results.scores.hlPercent > results.scores.slPercent
                  ? `Higher Level (${results.scores.hlPercent.toFixed(1)}%)`
                  : `Standard Level (${results.scores.slPercent.toFixed(1)}%)`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-school-red h-2.5 rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(100, 50 + (results.scores.hlPercent - results.scores.slPercent) / 2))}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Higher Level</span>
              <span className="text-xs text-gray-500">Standard Level</span>
            </div>
          </div>

          <div className="mt-4">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                You selected {totalSelections} options across {answersCount} questions
              </li>
              <li>
                Your response pattern indicates a{' '}
                {confidence >= 75
                  ? 'strong'
                  : confidence >= 60
                  ? 'moderate'
                  : 'mild'}{' '}
                preference
              </li>
              <li>
                Course confidence:{' '}
                <span className="font-medium">
                  {results.scores.courseConfidence.toFixed(1)}%
                </span>
              </li>
              <li>
                Level confidence:{' '}
                <span className="font-medium">
                  {results.scores.levelConfidence.toFixed(1)}%
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Key Topics, Strengths & Considerations */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-school-navy">
            Key Topics in {courseInfo.title}
          </h4>
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {courseInfo.topics.split(', ').map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>

          <h4 className="text-lg font-medium mb-3 text-school-navy mt-4">
            Strengths & Considerations
          </h4>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-medium text-sm mb-2 text-school-navy">
              Your Mathematical Strengths:
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm mb-4">
              {course === 'AA' ? (
                <>
                  <li>Abstract thinking and pattern recognition</li>
                  <li>Understanding mathematical theory</li>
                  <li>Working with algebraic expressions</li>
                </>
              ) : (
                <>
                  <li>Connecting mathematics to real-world scenarios</li>
                  <li>Data analysis and interpretation</li>
                  <li>Using technology to solve problems</li>
                </>
              )}
              {level === 'HL' && (
                <li>Handling complex and challenging concepts</li>
              )}
            </ul>

            <h5 className="font-medium text-sm mb-2 text-school-navy">
              Considerations:
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
              {course === 'AA' ? (
                <li>
                  Will need to develop strong algebraic manipulation skills
                </li>
              ) : (
                <li>
                  Will need to become comfortable with mathematical modeling
                </li>
              )}
              {level === 'HL' ? (
                <>
                  <li>Higher workload with additional topics</li>
                  <li>More abstract and challenging concepts</li>
                  <li>May require additional study time outside of class</li>
                </>
              ) : (
                <>
                  <li>Covers essential concepts with less theoretical depth</li>
                  <li>
                    More accessible but still requires consistent effort
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Career Pathways */}
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2 text-school-navy">
          Career Pathways
        </h4>
        <p className="text-gray-700 mb-2">
          This mathematics course is particularly suitable for students interested
          in:
        </p>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          {course === 'AA' && level === 'HL' && (
            <p>
              Pure and applied sciences, engineering, computer science,
              mathematics, architecture, and technology-oriented fields requiring
              strong theoretical foundations.
            </p>
          )}
          {course === 'AA' && level === 'SL' && (
            <p>
              Chemistry, biology, medicine, psychology, environmental sciences,
              and other STEM fields that require solid mathematical skills
              without the highest level of abstraction.
            </p>
          )}
          {course === 'AI' && level === 'HL' && (
            <p>
              Economics, business, data science, social sciences, environmental
              management, and fields requiring strong statistical analysis and
              modeling skills.
            </p>
          )}
          {course === 'AI' && level === 'SL' && (
            <p>
              Business administration, humanities, arts, design, communications,
              and fields where practical mathematical literacy is beneficial but
              not the primary focus.
            </p>
          )}
        </div>
      </div>

      {/* Course Comparison */}
      <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium mb-3 text-school-navy">
          Course Comparison
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-school-navy/5">
            <h5 className="text-base font-medium mb-2 text-school-navy flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-school-red" />
              Analysis & Approaches
            </h5>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AA' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                Emphasis on algebraic techniques and theory
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AA' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                Strong focus on calculus and proofs
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AA' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                Mathematical rigor and abstract thinking
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AA' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                For students who enjoy mathematical challenges
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-school-navy/5">
            <h5 className="text-base font-medium mb-2 text-school-navy flex items-center">
              <ChartBar className="h-4 w-4 mr-2 text-school-red" />
              Applications & Interpretation
            </h5>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AI' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                Focus on modeling real-world scenarios
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AI' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                Statistical analysis and data interpretation
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AI' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                Technology-based approach to problem solving
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${course === 'AI' ? 'bg-green-500' : 'bg-gray-300'}`}
                ></span>
                For students who prefer applied mathematics
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Note:</span> Both courses are rigorous and
            valuable. The right choice depends on your learning style, future
            plans, and preferences rather than difficulty level.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedAnalysis;
