import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, Calendar, User } from 'lucide-react';

interface SuccessMessageProps {
  studentName: string;
  itemVariants: any;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  studentName,
  itemVariants,
}) => {
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Show confetti animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.div
      className="mb-8 rounded-xl shadow-lg overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
      variants={itemVariants}
    >
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            const color = [
              '#E71D36', // Red
              '#003087', // Navy
              '#F9A825', // Gold
              '#4CAF50', // Green
              '#2196F3', // Blue
              '#9C27B0'  // Purple
            ][Math.floor(Math.random() * 6)];
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${left}%`,
                  top: -20,
                  width: size,
                  height: size,
                  backgroundColor: color,
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: ['0%', '100%'],
                  x: [`${left}%`, `${left + (Math.random() * 40 - 20)}%`],
                  opacity: [1, 0],
                  rotate: [0, Math.random() * 360]
                }}
                transition={{
                  duration: animDuration,
                  delay: delay,
                  ease: [0.1, 0.25, 0.85, 1],
                }}
              />
            );
          })}
        </div>
      )}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
      <div className="p-6 bg-white">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Results Saved Successfully!
            </h3>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center mb-3">
                <User className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-gray-700">Student: <span className="font-medium">{studentName}</span></span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                Your IB Mathematics course recommendation has been saved to our system. Your math teacher will review these results and discuss them with you during your next academic counseling session.
              </p>
              
              <div className="flex items-center text-xs text-gray-500 mt-4">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Saved on {new Date().toLocaleDateString()}</span>
                <Mail className="h-3.5 w-3.5 ml-3 mr-1" />
                <span>Notification sent to faculty</span>
              </div>
            </div>
            
            <motion.div 
              className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <motion.div 
                className="bg-green-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessMessage;
