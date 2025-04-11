import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart, PieChart, RadarIcon } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Ensure ChartJS components are registered if not done globally
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface SkillsProfileChartsProps {
  radarData: any;
  radarOptions: any;
  coursePreferenceData: any;
  levelPreferenceData: any;
  chartOptions: any;
  itemVariants: any;
}

const SkillsProfileCharts: React.FC<SkillsProfileChartsProps> = ({
  radarData,
  radarOptions,
  coursePreferenceData,
  levelPreferenceData,
  chartOptions,
  itemVariants,
}) => {
  
  // Create more appealing chart options
  const enhancedChartOptions = {
    ...chartOptions,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#172B4D',
        bodyColor: '#334155',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#64748B'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#64748B'
        }
      }
    }
  };
  
  // Create a more beautiful radar data with custom styling
  const enhancedRadarData = {
    ...radarData,
    datasets: [{
      ...radarData.datasets[0],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 0.8)',
      borderWidth: 2,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(59, 130, 246, 0.8)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      pointHoverBorderWidth: 3,
      pointHoverRadius: 6,
      pointRadius: 4,
      tension: 0.1
    }]
  };
  
  const enhancedRadarOptions = {
    ...radarOptions,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          usePointStyle: true,
          padding: 20,
          boxWidth: 8,
          boxHeight: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#172B4D',
        bodyColor: '#334155',
        padding: 12,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}: ${tooltipItems[0].raw}%`;
          },
          label: (context) => {
            return '';
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          circular: true
        },
        pointLabels: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
            weight: '500'
          },
          color: '#475569',
          padding: 10,
          // Callback to make labels wrap to prevent overflow
          callback: (value) => {
            const words = value.split(' ');
            if (words.length > 1) {
              return words.map((word, i) => i > 0 ? word : `${word}`);
            }
            return value;
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748B',
          font: {
            size: 10
          },
          showLabelBackdrop: false,
          z: 1,
          count: 5,
          stepSize: 20,
          callback: (value) => `${value}%`
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.1 // Add slight curve to lines
      }
    }
  };
  return (
    <motion.div className="mb-12" variants={itemVariants}>
      <div className="flex items-center mb-6">
        <motion.div 
          className="p-2 mr-3 bg-blue-100 rounded-full text-school-navy"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <PieChart className="w-5 h-5" />
        </motion.div>
        <h3 className="text-xl font-semibold text-school-navy">
          Your Mathematical Profile
        </h3>
        <motion.div 
          className="ml-auto text-xs text-blue-500 bg-blue-50 px-3 py-1 rounded-full font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Based on {radarData.labels.length} key dimensions
        </motion.div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div 
          className="col-span-1 bg-white p-5 rounded-xl shadow-md border border-gray-100 overflow-hidden"
          whileHover={{ y: -5, boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.1)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <RadarIcon className="w-5 h-5 text-indigo-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-800">
              Skills Assessment
            </h4>
          </div>
          <div className="h-64 mt-2 radar-chart chart-container">
            <Radar data={enhancedRadarData} options={enhancedRadarOptions} />
          </div>
          <div className="mt-4 text-xs text-gray-500 italic text-center">
            The radar chart shows your affinity across key mathematical dimensions
          </div>
        </motion.div>
        
        <motion.div 
          className="col-span-1 bg-white p-5 rounded-xl shadow-md border border-gray-100 overflow-hidden"
          whileHover={{ y: -5, boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.1)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <BarChart className="w-5 h-5 text-blue-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-800">
              Course Preference
            </h4>
          </div>
          <div className="h-64 mt-2 preference-chart chart-container">
            <Bar data={coursePreferenceData} options={enhancedChartOptions} />
          </div>
          <div className="mt-4 text-xs text-gray-500 italic text-center">
            Comparing your affinity between Analysis & Approaches and Applications & Interpretation
          </div>
        </motion.div>
        
        <motion.div 
          className="col-span-1 bg-white p-5 rounded-xl shadow-md border border-gray-100 overflow-hidden"
          whileHover={{ y: -5, boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.1)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-purple-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-800">
              Level Preference
            </h4>
          </div>
          <div className="h-64 mt-2 preference-chart chart-container">
            <Bar data={levelPreferenceData} options={enhancedChartOptions} />
          </div>
          <div className="mt-4 text-xs text-gray-500 italic text-center">
            Your readiness for Higher Level vs Standard Level coursework
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SkillsProfileCharts;
