import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, BarChart as ChartBar, GraduationCap, CheckCircle2 } from 'lucide-react';

interface RecommendationHeaderProps {
  course: 'AA' | 'AI';
  courseTitle: string;
  itemVariants: any;
  confidence?: number;
}

const RecommendationHeader: React.FC<RecommendationHeaderProps> = ({
  course,
  courseTitle,
  itemVariants,
  confidence = 85,
}) => {
  
  // Animation variants for special effects
  const iconVariants = {
    initial: { scale: 0, rotate: -45 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.7 
      }
    }
  };
  return (
    <motion.div className="mb-12" variants={itemVariants}>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
        <div className="text-center md:text-left max-w-lg mb-6 md:mb-0">
          <div className="flex items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Award className="h-7 w-7 mr-2 text-yellow-500" />
            </motion.div>
            <h4 className="font-medium text-yellow-700">IB Mathematics Recommendation</h4>
          </div>
          <h2 className="text-4xl font-bold text-school-navy mb-4 leading-tight">
            Your Personalized <span className="text-school-red">Course Match</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-md">
            Based on your responses, we've identified the ideal mathematics course aligned with your skills and goals.
          </p>
        </div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-school-navy/20 to-school-red/20 rounded-2xl blur-xl transform -rotate-6 scale-105 animate-pulse-subtle"></div>
          <motion.div
            className="relative flex items-center px-8 py-6 rounded-xl bg-white shadow-lg border-l-4 border-school-navy text-school-navy text-2xl font-semibold"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="mr-6">
              {course === 'AA' ? (
                <BookOpen className="h-10 w-10 text-school-navy" />
              ) : (
                <ChartBar className="h-10 w-10 text-school-navy" />
              )}
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-1">Recommended Course</div>
              <div className="text-xl md:text-2xl">{courseTitle}</div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                <span>Match confidence: <span className="font-semibold text-green-600">{confidence}%</span></span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-12"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default RecommendationHeader;
