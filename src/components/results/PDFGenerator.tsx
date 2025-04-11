import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { SchoolUser } from '../../services/schoolAuth';

interface PDFGeneratorProps {
  studentData: {
    name: string;
    email: string;
    school: string;
    recommendedCourse: string;
    confidenceScore: number;
    answers: Record<string, any>;
  };
  courseDetails: {
    name: string;
    description: string;
    level: string;
    path: string;
  };
  schoolInfo: {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ 
  studentData, 
  courseDetails,
  schoolInfo 
}) => {
  
  const generatePDF = () => {
    // Create new jsPDF instance
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors (use school colors or defaults)
    const primaryColor = schoolInfo.primaryColor || '#4f46e5';
    const secondaryColor = schoolInfo.secondaryColor || '#3b82f6';
    
    // ---- COVER PAGE ----
    
    // School logo if available
    if (schoolInfo.logoUrl) {
      try {
        doc.addImage(schoolInfo.logoUrl, 'PNG', pageWidth - 60, 10, 50, 20);
      } catch (e) {
        console.error('Error adding logo:', e);
      }
    }
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text('IB MATHS CHOICE', 20, 30);
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Student Recommendation Report', 20, 40);
    
    // School name
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`School: ${schoolInfo.name}`, 20, 55);
    
    // Student info box
    doc.setDrawColor(primaryColor);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, 65, pageWidth - 40, 40, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student: ${studentData.name}`, 30, 80);
    doc.text(`Email: ${studentData.email}`, 30, 90);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, 100);
    
    // Recommendation box
    doc.setDrawColor(secondaryColor);
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(20, 120, pageWidth - 40, 50, 3, 3, 'FD');
    
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('COURSE RECOMMENDATION', pageWidth/2, 135, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(courseDetails.name, pageWidth/2, 150, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Confidence Score: ${studentData.confidenceScore}%`, pageWidth/2, 165, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2025 IBMaths Choice - Page 1 of 3', pageWidth/2, pageHeight - 10, { align: 'center' });
    
    // ---- COURSE DETAILS PAGE ----
    doc.addPage();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text('Course Details', 20, 20);
    
    // Course info box
    doc.setDrawColor(primaryColor);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, 30, pageWidth - 40, 60, 3, 3, 'FD');
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${courseDetails.name}`, 30, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Level: ${courseDetails.level}`, 30, 60);
    doc.text(`Path: ${courseDetails.path}`, 30, 70);
    
    // Course description
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Split description text to fit in the page
    const splitDescription = doc.splitTextToSize(courseDetails.description, pageWidth - 60);
    doc.text(splitDescription, 30, 85);
    
    // Skills required section
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Skills Required', 20, 130);
    
    // Skills table
    const skillsTableData = [
      ['Algebra', courseDetails.path === 'AA' ? 'Strong' : 'Moderate'],
      ['Problem Solving', courseDetails.level === 'HL' ? 'Advanced' : 'Intermediate'],
      ['Abstract Thinking', courseDetails.path === 'AA' ? 'High' : 'Medium'],
      ['Real-world Applications', courseDetails.path === 'AI' ? 'Strong' : 'Moderate'],
      ['Use of Technology', courseDetails.path === 'AI' ? 'Extensive' : 'Moderate'],
    ];
    
    // @ts-ignore - jspdf-autotable plugin
    doc.autoTable({
      startY: 140,
      head: [['Skill', 'Level Required']],
      body: skillsTableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [primaryColor.substring(1, 3), primaryColor.substring(3, 5), primaryColor.substring(5, 7)].map(x => parseInt(x, 16)),
        textColor: [255, 255, 255]
      },
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2025 IBMaths Choice - Page 2 of 3', pageWidth/2, pageHeight - 10, { align: 'center' });
    
    // ---- DETAILED ANALYSIS PAGE ----
    doc.addPage();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text('Detailed Analysis', 20, 20);
    
    // Answers summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Response Analysis', 20, 35);
    
    // Prepare answers for the table
    const answerTableData = Object.entries(studentData.answers).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return [key, JSON.stringify(value)];
      }
      return [key, String(value)];
    });
    
    // Answers table
    // @ts-ignore - jspdf-autotable plugin
    doc.autoTable({
      startY: 45,
      head: [['Question', 'Response']],
      body: answerTableData.slice(0, 6), // Limit to first 6 responses to fit on page
      theme: 'grid',
      headStyles: { 
        fillColor: [secondaryColor.substring(1, 3), secondaryColor.substring(3, 5), secondaryColor.substring(5, 7)].map(x => parseInt(x, 16)),
        textColor: [255, 255, 255]
      },
    });
    
    // Final recommendations
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    
    // Get table end Y position
    // @ts-ignore - jspdf-autotable plugin
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.text('Final Recommendations', 20, finalY);
    
    // Create a standard recommendation based on the course
    let recommendation = '';
    if (courseDetails.path === 'AA' && courseDetails.level === 'HL') {
      recommendation = 'Student shows strong analytical skills and abstract thinking ability. Would benefit from extra practice with complex problems and advanced calculus concepts.';
    } else if (courseDetails.path === 'AA' && courseDetails.level === 'SL') {
      recommendation = 'Student has good algebra skills but may need support with complex topics. Focus on building confidence with analytical problem-solving.';
    } else if (courseDetails.path === 'AI' && courseDetails.level === 'HL') {
      recommendation = 'Student excels at applying mathematics to real-world scenarios. Would benefit from additional work with statistics and modeling.';
    } else {
      recommendation = 'Student shows practical approach to mathematics. Focus on strengthening foundations and real-world applications.';
    }
    
    // Split recommendation text to fit in the page
    const splitRecommendation = doc.splitTextToSize(recommendation, pageWidth - 40);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(splitRecommendation, 20, finalY + 15);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2025 IBMaths Choice - Page 3 of 3', pageWidth/2, pageHeight - 10, { align: 'center' });
    
    // Save the PDF
    doc.save(`IBMaths_Recommendation_${studentData.name.replace(/\s+/g, '_')}.pdf`);
  };
  
  return (
    <button
      onClick={generatePDF}
      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
      </svg>
      Generate PDF Report
    </button>
  );
};

export default PDFGenerator;
