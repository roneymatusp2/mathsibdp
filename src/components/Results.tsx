import React, { useState, useRef, useMemo, useEffect } from 'react';
// html2canvas will be imported dynamically when needed
import { calculateResults, Results as ResultsType } from '../utils/scoring';
import { 
  ArrowUpIcon as ArrowPathIcon, 
  BookOpen, 
  BrainCircuit, 
  Calculator, 
  BarChart as ChartBar, 
  Save, 
  Check,
  Mail,
  User,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  GraduationCap,
  Building,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BrainCog,
  Star,
  Clock,
  ArrowLeft,
  CheckCircle,
  Info,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

// Import sub-components
import RecommendationHeader from './results/RecommendationHeader';
import CourseInfoCard from './results/CourseInfoCard';
import SkillsProfileCharts from './results/SkillsProfileCharts';
import SampleProblemInfo from './results/SampleProblemInfo';
import ConfidenceAdvice from './results/ConfidenceAdvice';
import ActionButtons from './results/ActionButtons';
import AdvancedAnalysis from './results/AdvancedAnalysis';
import SaveResultsForm from './results/SaveResultsForm';
import SuccessMessage from './results/SuccessMessage';

interface ResultsProps {
  answers: Record<string, string[]>;
  sampleAnswers: Record<string, string>;
  onReset: () => void;
  onSaveResults?: (name: string, email: string, course: string, confidence: number) => void;
  studentInfo?: {name: string; email: string;} | null;
}

// Helper to get detailed course info
const getCourseDescription = (course: 'AA' | 'AI', level: 'HL' | 'SL') => {
    if (course === 'AA' && level === 'HL') {
      return {
        title: "Mathematics: Analysis and Approaches HL",
        focus: "Pure mathematical theory and proof-based learning",
        suitable: "Future mathematics, physics, engineering, or computer science students",
        topics: "Complex algebra, in-depth calculus, advanced proof techniques, vector geometry",
        workload: "Heavy - approximately 7+ hours per week"
      };
    } else if (course === 'AA' && level === 'SL') {
      return {
        title: "Mathematics: Analysis and Approaches SL",
        focus: "Mathematical theory with some applications",
        suitable: "STEM-oriented students who need mathematics but not at the highest level",
        topics: "Algebra, functions, trigonometry, calculus, statistics",
        workload: "Moderate - approximately 4-5 hours per week"
      };
    } else if (course === 'AI' && level === 'HL') {
      return {
        title: "Mathematics: Applications and Interpretation HL",
        focus: "Applied mathematics with technology and real-world modeling",
        suitable: "Future economics, business, social sciences, or design students",
        topics: "Statistics, probability, financial mathematics, modeling, some calculus",
        workload: "Heavy - approximately 6-7 hours per week"
      };
    } else { // AI SL
      return {
        title: "Mathematics: Applications and Interpretation SL",
        focus: "Practical applications of mathematics with technology",
        suitable: "Students needing mathematical literacy in non-STEM fields",
        topics: "Basic statistics, probability, functions, financial math",
        workload: "Moderate - approximately 3-4 hours per week"
      };
    }
  };

// Main Results Component
function Results({ 
  answers, 
  sampleAnswers, 
  onReset, 
  onSaveResults, 
  studentInfo 
}: ResultsProps) {
  // Animation controls
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start('visible');
  }, [controls]);
  
  // Calculate results using useMemo to avoid recalculation on every render
  const results = useMemo(() => calculateResults(answers), [answers]);
  const { course, level, confidence, details, scores } = results;
  const courseInfo = useMemo(() => getCourseDescription(course, level), [course, level]);

  const [saveName, setSaveName] = useState(studentInfo?.name || '');
  const [saveEmail, setSaveEmail] = useState(studentInfo?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(!!studentInfo);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const componentRef = useRef<HTMLDivElement>(null);

  // Chart Data Preparation (memoized)
  const radarData = useMemo(() => ({
    labels: ['Analytical Thinking', 'Abstract Concepts', 'Problem Solving', 'Real-world Apps', 'Data Analysis', 'Technology Use'],
    datasets: [{
      label: 'Your Profile',
      data: [
        course === 'AA' ? 65 + scores.aaPercent/5 : 40 + scores.aiPercent/5,
        course === 'AA' ? 70 + scores.aaPercent/6 : 35 + scores.aiPercent/6,
        level === 'HL' ? 65 + scores.hlPercent/5 : 45 + scores.slPercent/5,
        course === 'AI' ? 70 + scores.aiPercent/5 : 40 + scores.aaPercent/5,
        course === 'AI' ? 75 + scores.aiPercent/6 : 35 + scores.aaPercent/6,
        level === 'HL' ? 60 + scores.hlPercent/5 : 50 + scores.slPercent/5,
      ],
      backgroundColor: 'rgba(53, 162, 235, 0.2)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 2,
    }],
  }), [course, level, scores]);

  const coursePreferenceData = useMemo(() => ({
    labels: ['Analysis & Approaches', 'Applications & Interpretation'],
    datasets: [{
      label: 'Preference Score (%)',
      data: [scores.aaPercent, scores.aiPercent],
      backgroundColor: ['rgba(0, 48, 135, 0.7)', 'rgba(231, 29, 54, 0.7)'],
      borderColor: ['rgba(0, 48, 135, 1)', 'rgba(231, 29, 54, 1)'],
      borderWidth: 1,
    }],
  }), [scores]);

  const levelPreferenceData = useMemo(() => ({
    labels: ['Higher Level', 'Standard Level'],
    datasets: [{
      label: 'Preference Score (%)',
      data: [scores.hlPercent, scores.slPercent],
      backgroundColor: ['rgba(0, 48, 135, 0.7)', 'rgba(231, 29, 54, 0.7)'],
      borderColor: ['rgba(0, 48, 135, 1)', 'rgba(231, 29, 54, 1)'],
      borderWidth: 1,
    }],
  }), [scores]);

  // Chart Options (memoized)
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, max: 100 } }
  }), []);
  const radarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100 } }
  }), []);

  // Event Handlers
  const handleSave = (name: string, email: string) => {
    if (onSaveResults) {
      // If student name was already defined in StudentInfo, use it
      const studentNameToUse = studentInfo?.name || name;
      // Format email based on name if not provided
      let studentEmailToUse = email;
      if (!studentEmailToUse.includes('@')) {
        studentEmailToUse = `${studentNameToUse.toLowerCase().replace(/\s+/g, '.')}@stpauls.school`;
      }
      
      setSaveName(studentNameToUse);
      setSaveEmail(studentEmailToUse);
      onSaveResults(studentNameToUse, studentEmailToUse, `${course} ${level}`, confidence);
      setSaveSuccess(true);
    }
  };

  const exportToPDF = async () => {
    // First, change the UI state to indicate PDF generation is in progress
    try {
      if (!componentRef.current) {
        console.error('Component reference is not available');
        return;
      }
      
      setIsGeneratingPDF(true);
      
      // We'll use a hybrid approach, combining html2canvas with jsPDF
      // 1. First, create a custom PDF document from scratch with professional design
      // 2. Then, capture the charts using html2canvas to add them visually
      
      // Creating a new PDF document with A4 size (210 x 297 mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Main data that will be used in the report
      const studentNameForExport = studentInfo?.name || saveName || 'Student';
      const studentEmailForExport = studentInfo?.email || saveEmail || 'N/A';
      const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      try {
        // ===== HIGH QUALITY PDF DESIGN =====
        
        // 1. COVER PAGE
        // Background with subtle gradient (rectangles with transparency)
        for (let i = 0; i < 10; i++) {
          const alpha = 0.03 - (i * 0.003);
          doc.setFillColor(0, 48, 135);
          doc.setGState(new doc.GState({opacity: alpha}));
          doc.rect(0, 0 + (i*25), 210, 30, 'F');
        }
        
        // Header with color and modern design
        doc.setFillColor(0, 48, 135); // school-navy color
        doc.rect(0, 0, 210, 25, 'F');
        
        // Add a highlight line at the bottom of the header
        doc.setFillColor(231, 29, 54); // school-red color
        doc.rect(0, 25, 210, 1.5, 'F');
        
        // Logo/Title with style
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('IB MATHEMATICS', 105, 12, { align: 'center' });
        doc.setFontSize(14);
        doc.text('COURSE RECOMMENDATION', 105, 19, { align: 'center' });
        
        // Central cover zone - highlight area
        doc.setFillColor(245, 247, 255);
        doc.roundedRect(20, 40, 170, 60, 4, 4, 'F');
        
        // Main recommendation title
        doc.setTextColor(0, 48, 135);
        doc.setFontSize(16);
        doc.text('Recommended Course', 105, 55, { align: 'center' });
        
        // Decorative dividing line
        doc.setDrawColor(231, 29, 54);
        doc.setLineWidth(0.5);
        doc.line(70, 58, 140, 58);
        
        // Recommended course name (large and highlighted)
        doc.setFontSize(20);
        doc.setTextColor(231, 29, 54);
        doc.setFont('helvetica', 'bold');
        doc.text(courseInfo.title, 105, 70, { align: 'center' });
        
        // Confidence indicator
        doc.setFillColor(240, 247, 240);
        doc.roundedRect(70, 80, 70, 14, 3, 3, 'F');
        doc.setTextColor(0, 100, 0);
        doc.setFontSize(12);
        doc.text(`Confidence: ${confidence}%`, 105, 89, { align: 'center' });
        
        // Student data and metadata
        doc.setFillColor(240, 240, 250);
        doc.roundedRect(20, 115, 170, 40, 4, 4, 'F');
        
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('STUDENT INFORMATION', 40, 125);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Name:', 40, 135);
        doc.setFont('helvetica', 'normal');
        doc.text(studentNameForExport, 70, 135);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Email:', 40, 145);
        doc.setFont('helvetica', 'normal');
        doc.text(studentEmailForExport, 70, 145);
        
        // Generation date
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(20, 165, 80, 20, 4, 4, 'F');
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.text('REPORT GENERATED', 30, 174);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(currentDate, 30, 181);
        
        // QR Code placeholder (could be implemented for accessing results online)
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(110, 165, 80, 20, 4, 4, 'F');
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.text('REPORT ID', 120, 174);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        const reportId = Math.random().toString(36).substring(2, 10).toUpperCase();
        doc.text(reportId, 120, 181);
        
        // Footer note
        doc.setTextColor(130, 130, 130);
        doc.setFontSize(8);
        doc.text('This report is generated based on your responses to the IB Mathematics Course Selection Tool.', 105, 280, { align: 'center' });
        doc.text('The recommendation is meant to provide guidance, but final decisions should be made in consultation with teachers.', 105, 285, { align: 'center' });
        
        // 2. SECOND PAGE - COURSE DETAILS
        doc.addPage();
        
        // Secondary header
        doc.setFillColor(0, 48, 135); // school-navy color
        doc.rect(0, 0, 210, 15, 'F');
        
        // Add highlight line at the bottom of the header
        doc.setFillColor(231, 29, 54); // school-red color
        doc.rect(0, 15, 210, 1, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('IB MATHEMATICS COURSE DETAILS', 105, 10, { align: 'center' });
        
        // Page number in top right
        doc.setFillColor(231, 29, 54);
        doc.circle(195, 10, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('2', 195, 10, { align: 'center' });
        
        // Section title
        doc.setTextColor(0, 48, 135);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Course Profile: ' + courseInfo.title, 20, 30);
        
        // Decorative line
        doc.setDrawColor(231, 29, 54);
        doc.setLineWidth(0.5);
        doc.line(20, 33, 190, 33);
        
        // Course details in an elegant table
        const courseDetails = [
          ['Focus', courseInfo.focus],
          ['Suitable for', courseInfo.suitable],
          ['Key Topics', courseInfo.topics],
          ['Expected Workload', courseInfo.workload]
        ];
        
        // Add table with professional style
        doc.autoTable({
          startY: 40,
          head: [['Aspect', 'Details']],
          body: courseDetails,
          theme: 'grid',
          headStyles: { 
            fillColor: [0, 48, 135],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center' 
          },
          styles: {
            fontSize: 11,
            cellPadding: 6,
            lineWidth: 0.1,
            lineColor: [210, 210, 220]
          },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 45, fillColor: [245, 247, 250] },
            1: { cellWidth: 'auto' }
          },
          alternateRowStyles: {
            fillColor: [252, 252, 255]
          },
          margin: { left: 20, right: 20 }
        });
        
        // @ts-ignore -- TypeScript doesn't recognize lastAutoTable but it exists in jsPDF-AutoTable
        const finalY = (doc as any).lastAutoTable?.finalY || 120;
        
        // Recommendation and advice section
        doc.setTextColor(0, 48, 135);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('Personalized Recommendation', 20, finalY + 15);
        
        // Box for the advice
        doc.setDrawColor(100, 120, 200);
        doc.setFillColor(248, 250, 255);
        doc.roundedRect(20, finalY + 20, 170, 50, 3, 3, 'FD');
        
        // Tip icon (simulated with a small circle)
        doc.setFillColor(231, 29, 54);
        doc.circle(30, finalY + 30, 4, 'F');
        
        // Course advice
        doc.setTextColor(60, 60, 100);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const splitAdvice = doc.splitTextToSize(details.advice, 150);
        doc.text(splitAdvice, 40, finalY + 30);
        
        // 3. THIRD PAGE - METRICS AND SCORES
        doc.addPage();
        
        // Third page header
        doc.setFillColor(0, 48, 135);
        doc.rect(0, 0, 210, 15, 'F');
        doc.setFillColor(231, 29, 54);
        doc.rect(0, 15, 210, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('IB MATHEMATICS DETAILED ANALYSIS', 105, 10, { align: 'center' });
        
        // Page number
        doc.setFillColor(231, 29, 54);
        doc.circle(195, 10, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('3', 195, 10, { align: 'center' });
        
        // Section title
        doc.setTextColor(0, 48, 135);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance Metrics', 20, 30);
        
        // Decorative line
        doc.setDrawColor(231, 29, 54);
        doc.setLineWidth(0.5);
        doc.line(20, 33, 190, 33);
        
        // Metrics table with advanced design
        const scoreData = [
          ['Analysis & Approaches Score', `${scores.aaPercent.toFixed(1)}%`],
          ['Applications & Interpretation Score', `${scores.aiPercent.toFixed(1)}%`],
          ['Higher Level Readiness', `${scores.hlPercent.toFixed(1)}%`],
          ['Standard Level Readiness', `${scores.slPercent.toFixed(1)}%`],
          ['Overall Match', `${confidence}%`]
        ];
        
        // Add scores table
        doc.autoTable({
          startY: 40,
          body: scoreData,
          theme: 'grid',
          styles: { 
            fontSize: 11,
            cellPadding: 8,
            lineColor: [210, 210, 220],
            lineWidth: 0.1
          },
          columnStyles: {
            0: { fontStyle: 'bold', fillColor: [245, 247, 250] },
            1: { halign: 'center', fontStyle: 'bold' }
          },
          alternateRowStyles: {
            fillColor: [252, 252, 255]
          },
          didDrawCell: (data) => {
            // Add progress bars in score cells
            if (data.column.index === 1 && data.row.index >= 0) {
              const value = parseFloat(scoreData[data.row.index][1]);
              const percentage = Math.min(value, 100) / 100;
              const cellWidth = data.cell.width;
              const cellHeight = data.cell.height;
              const x = data.cell.x + 2;
              const y = data.cell.y + cellHeight / 2 - 1;
              const width = (cellWidth - 4) * percentage;
              
              // Choose colors based on score
              let fillColor;
              if (value >= 80) fillColor = [0, 150, 0]; // Green
              else if (value >= 60) fillColor = [0, 100, 150]; // Blue
              else if (value >= 40) fillColor = [255, 150, 0]; // Orange
              else fillColor = [200, 0, 0]; // Red
              
              doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
              doc.roundedRect(x, y, width, 2, 1, 1, 'F');
            }
          },
          margin: { left: 30, right: 30 }
        });
        
        // Reserve space for charts that will be captured with html2canvas
        // @ts-ignore
        const tableEndY = (doc as any).lastAutoTable?.finalY || 100;
        
        // Reserve space and add title for charts
        doc.setTextColor(0, 48, 135);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('Proficiency Profile Charts', 20, tableEndY + 15);
        
        doc.setDrawColor(231, 29, 54);
        doc.setLineWidth(0.5);
        doc.line(20, tableEndY + 18, 190, tableEndY + 18);
        
        // Reserved space for charts
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(20, tableEndY + 25, 170, 100, 3, 3, 'F');
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text('Charts will be added from the interactive interface...', 105, tableEndY + 70, { align: 'center' });
        
        // Add footer to all pages
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          
          // Professional design footer
          doc.setFillColor(240, 240, 245);
          doc.rect(0, 287, 210, 10, 'F');
          
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Page ${i} of ${pageCount} | IB Mathematics Selection Tool`, 105, 293, { align: 'center' });
          
          // Date in smaller format in footer
          doc.setFontSize(7);
          doc.text(currentDate, 20, 293);
          
          // Logo or school text in footer on the right
          doc.setFontSize(7);
          doc.setTextColor(80, 80, 80);
          doc.text('IBMATHS CHOICE', 190, 293, { align: 'right' });
        }
        
        // STEP 2: CAPTURE CHARTS WITH HTML2CANVAS
        // Now we'll capture the charts from the interface using html2canvas
        // and add them to the PDF
        
        try {
          // Specific elements to be captured
          // First, let's find the element containing the charts
          const chartElements = document.querySelectorAll('.chart-container canvas');
          if (chartElements && chartElements.length > 0) {
            // Set the page where charts will be added
            doc.setPage(3);
            
            // Capture and add each chart individually
            // This provides better quality than capturing them all together
            const html2canvas = (await import('html2canvas')).default;
            
            // Try to capture the radar chart first (if it exists)
            const radarChart = document.querySelector('.radar-chart canvas');
            if (radarChart) {
              const canvas = await html2canvas(radarChart as HTMLElement, {
                scale: 2, // Larger scale for better quality
                backgroundColor: null,
                logging: false
              });
              
              // Convert the canvas to image and add to PDF
              const imgData = canvas.toDataURL('image/png');
              doc.addImage(imgData, 'PNG', 30, tableEndY + 35, 70, 70, undefined, 'FAST');
              
              // Caption for the radar chart
              doc.setFontSize(9);
              doc.setTextColor(60, 60, 100);
              doc.setFont('helvetica', 'bold');
              doc.text('Skills Profile Radar', 65, tableEndY + 115, { align: 'center' });
            }
            
            // Try to capture the bar chart or donut (as available)
            const barChart = document.querySelector('.preference-chart canvas');
            if (barChart) {
              const canvas = await html2canvas(barChart as HTMLElement, {
                scale: 2,
                backgroundColor: null,
                logging: false
              });
              
              // Convert and add to PDF
              const imgData = canvas.toDataURL('image/png');
              doc.addImage(imgData, 'PNG', 110, tableEndY + 35, 70, 70, undefined, 'FAST');
              
              // Caption
              doc.setFontSize(9);
              doc.setTextColor(60, 60, 100);
              doc.setFont('helvetica', 'bold');
              doc.text('Course Preference Distribution', 145, tableEndY + 115, { align: 'center' });
            }
          }
        } catch (chartError) {
          console.warn('Could not capture charts:', chartError);
          // Continue even if chart capture fails
        }
        
        // Finally, save the PDF with professional naming
        const fileName = `IB_Math_Recommendation_${studentNameForExport.replace(/\s+/g, '_')}_${reportId}.pdf`;
        doc.save(fileName);
        console.log('PDF exported successfully:', fileName);
        
      } catch (primaryError) {
        console.error('Error in advanced PDF generation, trying alternative method:', primaryError);
        
        // COMPLETE FALLBACK - USING HTML2CANVAS TO CAPTURE THE ENTIRE PAGE
        try {
          // Inform the user that we're trying an alternative method
          console.log('Trying alternative PDF generation method...');
          
          // Dynamically import html2canvas to ensure it's available
          const html2canvas = (await import('html2canvas')).default;
          
          // We'll capture the entire component and convert it to a PDF
          if (componentRef.current) {
            // Temporarily remove the floating navigation bar for the capture
            const navElements = document.querySelectorAll('.fixed');
            const originalDisplayStyles: string[] = [];
            
            // Hide elements we don't want in the PDF
            navElements.forEach((el) => {
              const element = el as HTMLElement;
              originalDisplayStyles.push(element.style.display);
              element.style.display = 'none';
            });
            
            // Capture the component
            const canvas = await html2canvas(componentRef.current, {
              scale: 1.5, // Reasonable scale for quality vs size
              useCORS: true,
              allowTaint: true,
              logging: false,
              backgroundColor: '#ffffff'
            });
            
            // Restore original styles
            navElements.forEach((el, index) => {
              (el as HTMLElement).style.display = originalDisplayStyles[index];
            });
            
            // Calculate dimensions to fit A4 PDF
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Create new PDF document
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
              unit: 'mm',
              format: 'a4'
            });
            
            // If image height is larger than A4 page, split into multiple pages
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = imgHeight;
            let position = 0;
            let page = 1;
            
            // First page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
            
            // Additional pages if needed
            while (heightLeft > 0) {
              position = -pageHeight * page;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
              heightLeft -= pageHeight;
              page++;
            }
            
            // Add simple footer
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              pdf.setPage(i);
              pdf.setFontSize(8);
              pdf.setTextColor(150, 150, 150);
              pdf.text(`Page ${i} of ${pageCount} | IB Mathematics Course Selection`, 105, 290, { align: 'center' });
            }
            
            // Save the PDF
            pdf.save(`IB_Math_Recommendation_${studentNameForExport.replace(/\s+/g, '_')}_Screenshot.pdf`);
            console.log('Alternative PDF exported successfully');
          }
        } catch (fallbackError) {
          console.error('Failed with alternative method too:', fallbackError);
          
          // LAST RESORT - EXTREMELY BASIC PDF
          try {
            // Create a super simple PDF with just text
            const basicPdf = new jsPDF();
            
            basicPdf.setFontSize(16);
            basicPdf.setTextColor(0, 0, 0);
            basicPdf.text("IB Mathematics Course Recommendation", 20, 20);
            basicPdf.setFontSize(12);
            basicPdf.text(`Student: ${studentNameForExport}`, 20, 30);
            basicPdf.text(`Recommended Course: ${courseInfo.title}`, 20, 40);
            basicPdf.text(`Confidence: ${confidence}%`, 20, 50);
            basicPdf.text('Course Details:', 20, 60);
            basicPdf.text(`Focus: ${courseInfo.focus}`, 25, 70);
            basicPdf.text(`Suitable for: ${courseInfo.suitable}`, 25, 80);
            basicPdf.text(`Workload: ${courseInfo.workload}`, 25, 90);
            
            basicPdf.setFontSize(12);
            basicPdf.text('Advice:', 20, 110);
            const splitAdvice = basicPdf.splitTextToSize(details.advice, 170);
            basicPdf.text(splitAdvice, 20, 120);
            
            basicPdf.save(`IB_Math_Recommendation_Basic.pdf`);
            console.log('Basic PDF exported as last resort');
          } catch (finalError) {
            // If even the basic PDF fails, display clear message to user
            console.error('Complete failure in PDF generation:', finalError);
            alert('Could not generate PDF. Please try again or use the Excel option.');
          }
        }
      }
      
    } catch (error) {
      console.error('Error in PDF export:', error);
      alert('There was an error creating the PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // Adicionar um indicador visual de que o PDF está sendo gerado
  useEffect(() => {
    let loadingToast: HTMLDivElement | null = null;
    
    // Display loading toast when isGeneratingPDF changes to true
    if (isGeneratingPDF) {
      loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-white shadow-xl rounded-lg p-4 z-50 flex items-center space-x-3';
      loadingToast.innerHTML = `
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-school-navy"></div>
        <div>Generating professional PDF...</div>
      `;
      document.body.appendChild(loadingToast);
    }
    
    // Remove the toast when isGeneratingPDF changes to false
    return () => {
      if (loadingToast) {
        document.body.removeChild(loadingToast);
      }
    };
  }, [isGeneratingPDF]);
  
  const exportToExcel = () => {
    const studentNameForExport = studentInfo?.name || saveName;
    const studentEmailForExport = studentInfo?.email || saveEmail;
    const wsData = [
      ["IB Mathematics Course Recommendation"],
      [""],
      ["Generated on:", new Date().toLocaleDateString()],
      [""],
      ["Student:", studentNameForExport],
      ["Email:", studentEmailForExport],
      [""],
      ["Recommended Course:", courseInfo.title],
      ["Confidence:", `${confidence}%`],
      [""],
      ["Course Details"],
      ["Focus:", courseInfo.focus],
      ["Suitable for:", courseInfo.suitable],
      ["Key Topics:", courseInfo.topics],
      ["Expected Workload:", courseInfo.workload],
      [""],
      ["Advice:"],
      [details.advice],
      [""],
      ["Profile Metrics"],
      ["Analysis & Approaches Score:", `${scores.aaPercent.toFixed(1)}%`],
      ["Applications & Interpretation Score:", `${scores.aiPercent.toFixed(1)}%`],
      ["Higher Level Score:", `${scores.hlPercent.toFixed(1)}%`],
      ["Standard Level Score:", `${scores.slPercent.toFixed(1)}%`],
      ["Course Confidence:", `${scores.courseConfidence.toFixed(1)}%`],
      ["Level Confidence:", `${scores.levelConfidence.toFixed(1)}%`],
      ["Overall Confidence:", `${confidence}%`]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recommendation");
    XLSX.writeFile(wb, `IB_Math_Recommendation_${studentNameForExport || 'Student'}.xlsx`);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1, duration: 0.8 } }
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90, damping: 15, duration: 0.7 } }
  };
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };
  const scaleInVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.7, type: 'spring' } }
  };

  // Calculate counts needed for sub-components
  const totalSelections = useMemo(() => 
     Object.values(answers).reduce((total, selections) => total + selections.length, 0),
     [answers]
  );
  const answersCount = useMemo(() => Object.keys(answers).length, [answers]);
  const sampleAnswersCount = useMemo(() => Object.keys(sampleAnswers).length, [sampleAnswers]);

  return (
    <div className="max-w-6xl mx-auto pb-12 relative" ref={componentRef}>
      {/* Floating sticky navigation */}
      <motion.div 
        className="hidden md:flex fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-rich py-2 px-1 z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7, type: 'spring' }}
      >
        <motion.button
          onClick={onReset}
          className="flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-school-navy hover:bg-blue-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Start Over</span>
        </motion.button>
        
        <motion.button
          onClick={exportToPDF}
          className="flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors relative"
          whileHover={!isGeneratingPDF ? { scale: 1.05 } : {}}
          whileTap={!isGeneratingPDF ? { scale: 0.98 } : {}}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Generating...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">PDF</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          onClick={exportToExcel}
          className="flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Excel</span>
        </motion.button>
        
        <motion.button
          onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
          className="flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <BrainCircuit className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{showAdvancedDetails ? 'Hide Details' : 'Details'}</span>
        </motion.button>
      </motion.div>
      <motion.div 
        className="bg-white rounded-xl shadow-2xl overflow-hidden"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="h-2.5 bg-gradient-to-r from-school-navy via-blue-500 to-school-red"></div>
        <div className="bg-gradient-to-b from-blue-50/80 to-white p-8 md:p-10 lg:p-12">
          
          <RecommendationHeader 
            course={course}
            courseTitle={courseInfo.title}
            itemVariants={itemVariants}
            confidence={confidence}
          />

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10" 
            variants={itemVariants}
          >
            <CourseInfoCard
              icon={Lightbulb}
              title="Course Focus"
              description={details.focus}
              secondaryInfoIcon={GraduationCap}
              secondaryInfoText={`Suitable for: ${courseInfo.suitable}`}
              itemVariants={itemVariants}
            />
            <CourseInfoCard
              icon={BrainCircuit}
              title="Learning Style Match"
              description={details.style}
              secondaryInfoIcon={Building}
              secondaryInfoText={`Workload: ${courseInfo.workload}`}
              itemVariants={itemVariants}
            />
          </motion.div>
          
          <SkillsProfileCharts 
            radarData={radarData}
            radarOptions={radarOptions}
            coursePreferenceData={coursePreferenceData}
            levelPreferenceData={levelPreferenceData}
            chartOptions={chartOptions}
            itemVariants={itemVariants}
          />

          <SampleProblemInfo 
            sampleAnswersCount={sampleAnswersCount}
            itemVariants={itemVariants}
          />

          <ConfidenceAdvice 
            confidence={confidence}
            advice={details.advice}
            itemVariants={itemVariants}
          />
          
          <ActionButtons
            showAdvancedDetails={showAdvancedDetails}
            onToggleAdvancedDetails={() => setShowAdvancedDetails(!showAdvancedDetails)}
            onExportPDF={exportToPDF}
            onExportExcel={exportToExcel}
            onReset={onReset}
            itemVariants={itemVariants}
            isGeneratingPDF={isGeneratingPDF}
          />
          
          {showAdvancedDetails && (
            <AdvancedAnalysis 
              results={results}
              courseInfo={courseInfo}
              totalSelections={totalSelections}
              answersCount={answersCount}
            />
          )}

          <AnimatePresence mode="wait">
            {!saveSuccess && onSaveResults && (
              <motion.div
                key="save-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SaveResultsForm
                  studentInfo={studentInfo} 
                  onSaveResults={handleSave}
                  itemVariants={scaleInVariants}
                />
              </motion.div>
            )}

            {saveSuccess && (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                <SuccessMessage 
                  studentName={studentInfo?.name || saveName}
                  itemVariants={fadeInVariants}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
        <div className="h-1.5 bg-gradient-to-r from-school-red via-blue-500 to-school-navy"></div>
      </motion.div>
    </div>
  );
}

export default Results;