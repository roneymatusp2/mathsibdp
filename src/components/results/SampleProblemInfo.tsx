import React from 'react';
import { motion } from 'framer-motion';

interface SampleProblemInfoProps {
  sampleAnswersCount: number;
  itemVariants: any;
}

const SampleProblemInfo: React.FC<SampleProblemInfoProps> = ({
  sampleAnswersCount,
  itemVariants,
}) => {
  if (sampleAnswersCount === 0) {
    return null; // Don't render if no sample problems were answered
  }

  return (
    <motion.div
      className="bg-school-navy/5 p-6 rounded-lg mb-10"
      variants={itemVariants}
    >
      <h3 className="text-xl font-semibold mb-3 text-school-navy">
        Sample Problem Results
      </h3>
      <p className="text-gray-700">
        You attempted {sampleAnswersCount} sample problems. These problems were designed
        to give you a taste of different mathematical approaches you might encounter
        in your chosen course.
      </p>
    </motion.div>
  );
};

export default SampleProblemInfo;
