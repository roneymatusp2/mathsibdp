import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface ConfidenceAdviceProps {
  confidence: number;
  advice: string;
  itemVariants: any;
}

const ConfidenceAdvice: React.FC<ConfidenceAdviceProps> = ({
  confidence,
  advice,
  itemVariants,
}) => {
  // Determine confidence level styling
  const getConfidenceLevel = () => {
    if (confidence >= 85) return {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      title: 'High Confidence Match',
      accent: 'bg-green-500'
    };
    if (confidence >= 70) return {
      icon: Lightbulb,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      title: 'Good Confidence Match',
      accent: 'bg-blue-500'
    };
    return {
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-500',
      title: 'Moderate Confidence Match',
      accent: 'bg-amber-500'
    };
  };
  
  const confidenceStyle = getConfidenceLevel();
  const Icon = confidenceStyle.icon;

  return (
    <motion.div
      className={`${confidenceStyle.bgColor} rounded-2xl shadow-md overflow-hidden mb-10`}
      variants={itemVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top accent line */}
      <div className={`h-1.5 ${confidenceStyle.accent}`}></div>
      
      <div className="p-6">
        <div className="flex items-start">
          <div className={`p-3 rounded-full ${confidenceStyle.bgColor} ${confidenceStyle.color} border ${confidenceStyle.borderColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${confidenceStyle.color}`}>
                {confidenceStyle.title}
              </h3>
              
              <motion.div 
                className={`flex items-center bg-white py-1 px-3 rounded-full shadow-sm border ${confidenceStyle.borderColor}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <span className="text-sm text-gray-500 mr-2">Confidence</span>
                <span className={`font-bold text-lg ${confidenceStyle.color}`}>{confidence}%</span>
              </motion.div>
            </div>
            
            <div className="mt-4 bg-white bg-opacity-60 p-4 rounded-xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed">{advice}</p>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className={confidenceStyle.accent}
                style={{ width: `${confidence}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfidenceAdvice;
