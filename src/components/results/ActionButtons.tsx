import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  ArrowUpIcon as ArrowPathIcon,
} from 'lucide-react';

interface ActionButtonsProps {
  showAdvancedDetails: boolean;
  onToggleAdvancedDetails: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onReset: () => void;
  itemVariants: any;
  isGeneratingPDF?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  showAdvancedDetails,
  onToggleAdvancedDetails,
  onExportPDF,
  onExportExcel,
  onReset,
  itemVariants,
  isGeneratingPDF = false,
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  return (
    <motion.div 
      variants={itemVariants}
      className="mb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-xl p-6 shadow-inner">
        <div className="mb-6 md:mb-0 flex flex-col sm:flex-row items-center">
          <div className="relative">
            <motion.button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Download className="h-4 w-4 mr-2 text-school-navy" />
              Export Results
              {showExportOptions ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </motion.button>

            {showExportOptions && (
              <motion.div 
                className="absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-100 z-10 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-1">
                  <motion.button
                    onClick={() => { onExportPDF(); setShowExportOptions(false); }}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    whileHover={{ x: 5 }}
                    disabled={isGeneratingPDF}
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 bg-red-50 rounded-md mr-3">
                        {isGeneratingPDF ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <FileText className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{isGeneratingPDF ? 'Generating PDF...' : 'PDF Document'}</div>
                        <div className="text-xs text-gray-500">Save as printable document</div>
                      </div>
                    </div>
                  </motion.button>
                  <motion.button
                    onClick={() => { onExportExcel(); setShowExportOptions(false); }}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 bg-green-50 rounded-md mr-3">
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">Excel Spreadsheet</div>
                        <div className="text-xs text-gray-500">Export detailed data</div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          <motion.button
            onClick={onToggleAdvancedDetails}
            className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 sm:ml-4 mt-4 sm:mt-0"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <BrainCircuit className="h-4 w-4 mr-2 text-purple-500" />
            {showAdvancedDetails ? 'Hide Advanced Analysis' : 'Show Advanced Analysis'}
            {showAdvancedDetails ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </motion.button>
        </div>

        <motion.button
          onClick={onReset}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-school-navy to-school-red text-sm font-medium rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Retake Questionnaire
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActionButtons;
