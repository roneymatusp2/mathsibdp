import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, GraduationCap, Building, CheckCircle } from 'lucide-react';

interface CourseInfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  secondaryInfoIcon: LucideIcon;
  secondaryInfoText: string;
  itemVariants: any;
}

const CourseInfoCard: React.FC<CourseInfoCardProps> = ({
  icon: Icon,
  title,
  description,
  secondaryInfoIcon: SecondaryIcon,
  secondaryInfoText,
  itemVariants
}) => {
  return (
    <motion.div
      className="relative overflow-hidden bg-white p-6 rounded-xl shadow-md border border-gray-100"
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle gradient accent in background */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 blur-xl opacity-70"></div>
      
      <div className="relative">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-gradient-to-br from-school-navy/10 to-school-red/10 rounded-lg mr-3">
            <Icon className="h-6 w-6 text-school-red" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
        </div>
        
        <div className="pl-3 border-l-4 border-school-navy/20 my-4">
          <p className="text-gray-700">{description}</p>
        </div>
        
        <div className="flex items-center mt-6 pt-5 border-t border-gray-100 text-sm text-gray-700">
          <div className="p-1.5 bg-blue-50 rounded-md mr-2 text-blue-500">
            <SecondaryIcon className="h-4 w-4" />
          </div>
          <span>{secondaryInfoText}</span>
          
          {/* Decorative check indicator */}
          <div className="ml-auto p-1 rounded-full bg-green-50 text-green-500">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseInfoCard;
