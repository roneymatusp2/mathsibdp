import React, { useState, useEffect } from 'react';
import { getAllStudentRecords, exportStudentsToCSV, type StudentRecord } from '../services/students';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download, LogOut, Search, Users, ChevronDown, Filter } from 'lucide-react';

// Interface para escola (adicionada)
interface School {
  id: string;
  name: string;
}

// Interface para filtros avançados
interface FilterOptions {
  course: string | null;
  gender: string | null;
  school: string | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

interface AdminDashboardProps {
  onLogout: () => void;
  onCompleteLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // List of available schools (would be loaded from backend in production)
  const [schools] = useState<School[]>([
    { id: '1', name: 'St. Paul\'s School' },
    { id: '2', name: 'British College' },
    { id: '3', name: 'American School' },
    { id: '4', name: 'St. Francis College' },
    { id: '5', name: 'Escola Suíço-Brasileira' }
  ]);
  
  // Mock data for gender (in production, this would be a field in the student record)
  const studentGenders: Record<string, 'male' | 'female'> = {
    '1': 'female',
    '2': 'male',
    '3': 'female',
    '4': 'male',
    '5': 'female'
  };
  
  // Initialize student data with initial values
  // This will be replaced with actual data from the service in useEffect
  useEffect(() => {
    // Fetch student data
    const fetchStudents = async () => {
      try {
        const records = await getAllStudentRecords();
        setStudents(records);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    course: null,
    gender: null,
    school: null,
    dateRange: {
      start: null,
      end: null
    }
  });

  // Filter students with advanced options
  const filteredStudents = students.filter(student => {
    // Text search filter
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by course
    const matchesCourse = !filters.course ? true : 
      student.recommendedCourse === filters.course;
    
    // Filter by gender (using mocked data)
    const matchesGender = !filters.gender ? true : 
      studentGenders[student.id] === filters.gender;
    
    // Filter by school (extracted from email domain)
    const matchesSchool = !filters.school ? true : 
      student.email.split('@')[1].includes(filters.school);
    
    // Filter by date
    const studentDate = new Date(student.timestamp);
    const matchesDateStart = !filters.dateRange.start ? true : 
      studentDate >= new Date(filters.dateRange.start);
    const matchesDateEnd = !filters.dateRange.end ? true : 
      studentDate <= new Date(filters.dateRange.end);
    
    return matchesSearch && matchesCourse && matchesGender && 
           matchesSchool && matchesDateStart && matchesDateEnd;
  });

  // Export data as CSV
  const exportToCSV = async () => {
    try {
      const csvData = await exportStudentsToCSV(filteredStudents);
      
      // Create blob and download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ib-maths-assessments-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export data to CSV. Please try again.');
    }
  };
  
  // Export to Excel
  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const worksheetData = filteredStudents.map(student => ({
        ID: student.id,
        Name: student.name,
        Email: student.email,
        School: student.email.split('@')[1],
        Gender: studentGenders[student.id] || 'Unknown',
        Date: new Date(student.timestamp).toLocaleDateString(),
        Time: new Date(student.timestamp).toLocaleTimeString(),
        'Recommended Course': student.recommendedCourse,
        'Confidence Score': student.confidenceScore,
        'Responses': JSON.stringify(student.answers)
      }));
      
      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Records');
      
      // Create Excel file and download
      XLSX.writeFile(workbook, `ib-maths-assessments-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data to Excel. Please try again.');
    }
  };
  
  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Document title
      doc.setFontSize(18);
      doc.text('IB Maths Choice - Student Reports', 14, 22);
      
      // Report information
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Total records: ${filteredStudents.length}`, 14, 35);
      
      // Create table
      const tableColumn = ['Name', 'Email', 'Date', 'Recommended', 'Score'];
      const tableRows = filteredStudents.map(student => [
        student.name,
        student.email,
        new Date(student.timestamp).toLocaleDateString(),
        student.recommendedCourse,
        `${student.confidenceScore}%`
      ]);
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [51, 122, 183] }
      });
      
      doc.save(`ib-maths-assessments-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export data to PDF. Please try again.');
    }
  };
  
  // Open modal with student details
  const viewStudentDetails = (student: StudentRecord) => {
    setActiveStudent(student);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-school-navy/10 p-2 rounded-full">
              <Users className="h-6 w-6 text-school-navy" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IB MATHS CHOICE Admin</h1>
              <p className="text-sm text-gray-500">Staff Dashboard</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-school-navy hover:bg-school-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-navy"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{students.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <div className="h-6 w-6 text-green-600 flex items-center justify-center font-bold">
                    AA
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Analysis & Approaches</dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {students.filter(s => s.recommendedCourse.includes('AA')).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <div className="h-6 w-6 text-blue-600 flex items-center justify-center font-bold">
                    AI
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Applications & Interpretation</dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {students.filter(s => s.recommendedCourse.includes('AI')).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <div className="h-6 w-6 text-purple-600 flex items-center justify-center font-bold">
                    HL
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Higher Level Students</dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {students.filter(s => s.recommendedCourse.includes('HL')).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter by course */}
              <div className="w-full md:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filters.course || ''}
                    onChange={(e) => setFilters({...filters, course: e.target.value || null})}
                  >
                    <option value="">All Courses</option>
                    <option value="AA HL">AA HL</option>
                    <option value="AA SL">AA SL</option>
                    <option value="AI HL">AI HL</option>
                    <option value="AI SL">AI SL</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Filter by gender */}
              <div className="w-full md:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filters.gender || ''}
                    onChange={(e) => setFilters({...filters, gender: e.target.value || null})}
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Filter by school */}
              <div className="w-full md:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filters.school || ''}
                    onChange={(e) => setFilters({...filters, school: e.target.value || null})}
                  >
                    <option value="">All Schools</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.name.toLowerCase().replace(/\s/g, '')}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Export menu */}
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-school-navy hover:bg-school-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-navy"
                    id="export-menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => document.getElementById('export-dropdown')?.classList.toggle('hidden')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                </div>
                
                <div
                  id="export-dropdown"
                  className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="export-menu-button"
                  tabIndex={-1}
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={exportToCSV}
                      className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white shadow rounded-lg p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-school-navy"></div>
            <span className="ml-3 text-lg text-gray-700">Loading data...</span>
          </div>
        ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(student.timestamp).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{new Date(student.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.recommendedCourse.includes('AA') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.recommendedCourse}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              student.confidenceScore > 85 ? 'bg-green-600' : 
                              student.confidenceScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.confidenceScore}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">{student.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => viewStudentDetails(student)}
                        className="text-school-red hover:text-school-dark-red"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No students found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </main>
      
      {/* Student details modal with comprehensive analysis */}
      {showModal && activeStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Comprehensive Student Analysis
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 max-h-[80vh] overflow-y-auto pr-4">
                {/* Student Info Card */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                  <div className="p-4 border-b">
                    <h4 className="text-lg font-semibold text-gray-800">Student Information</h4>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="mb-3">
                        <span className="font-semibold text-gray-700">Name:</span> 
                        <span className="ml-2 text-gray-900">{activeStudent.name}</span>
                      </p>
                      <p className="mb-3">
                        <span className="font-semibold text-gray-700">Email:</span> 
                        <span className="ml-2 text-gray-900">{activeStudent.email}</span>
                      </p>
                      <p className="mb-3">
                        <span className="font-semibold text-gray-700">School:</span> 
                        <span className="ml-2 text-gray-900">{activeStudent.email.split('@')[1]}</span>
                      </p>
                    </div>
                    <div>
                      <p className="mb-3">
                        <span className="font-semibold text-gray-700">Submission Date:</span> 
                        <span className="ml-2 text-gray-900">{new Date(activeStudent.timestamp).toLocaleString()}</span>
                      </p>
                      <p className="mb-3">
                        <span className="font-semibold text-gray-700">Recommended Course:</span> 
                        <span className="ml-2 text-gray-900 font-medium">{activeStudent.recommendedCourse}</span>
                      </p>
                      <p className="mb-3 flex items-center">
                        <span className="font-semibold text-gray-700">Confidence Score:</span> 
                        <span className="ml-2 text-gray-900">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  activeStudent.confidenceScore > 85 ? 'bg-green-600' : 
                                  activeStudent.confidenceScore > 70 ? 'bg-blue-500' : 
                                  activeStudent.confidenceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${activeStudent.confidenceScore}%` }}
                              ></div>
                            </div>
                            <span>{activeStudent.confidenceScore}%</span>
                          </div>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Analysis */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                  <div className="p-4 border-b">
                    <h4 className="text-lg font-semibold text-gray-800">Course Analysis</h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                          Course Path Analysis
                        </h5>
                        <p className="text-gray-600">
                          Based on the student's responses, they show a stronger affinity toward 
                          <span className="font-medium"> {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 'Analysis & Approaches' : 'Applications & Interpretation'}</span>. 
                          This suggests they {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 
                            'enjoy developing mathematical arguments and exploring abstract applications.' : 
                            'prefer seeing mathematics used in real-world contexts with technology integration.'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          Difficulty Level Match
                        </h5>
                        <p className="text-gray-600">
                          The student's responses indicate they would be most successful at the 
                          <span className="font-medium"> {activeStudent.recommendedCourse.split(' ')[1]} (Higher/Standard Level)</span> curriculum. 
                          This is based on their demonstrated comfort with {activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                            'complex mathematical concepts and the required time commitment.' : 
                            'core mathematical concepts while balancing other academic priorities.'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-indigo-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                        Key Course Information: {activeStudent.recommendedCourse}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-indigo-900 mb-2"><span className="font-medium">Focus:</span> {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Pure mathematical theory and proof-based learning' : 
                              'Mathematical theory with some applications') : 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Applied mathematics with technology and real-world modeling' : 
                              'Practical applications of mathematics with technology')
                          }</p>
                          <p className="text-sm text-indigo-900"><span className="font-medium">Key Topics:</span> {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Complex algebra, in-depth calculus, advanced proof techniques, vector geometry' : 
                              'Algebra, functions, trigonometry, calculus, statistics') : 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Statistics, probability, financial mathematics, modeling, some calculus' : 
                              'Basic statistics, probability, functions, financial math')
                          }</p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-900 mb-2"><span className="font-medium">Suitable for:</span> {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Future mathematics, physics, engineering, or computer science students' : 
                              'STEM-oriented students who need mathematics but not at the highest level') : 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Future economics, business, social sciences, or design students' : 
                              'Students needing mathematical literacy in non-STEM fields')
                          }</p>
                          <p className="text-sm text-indigo-900"><span className="font-medium">Workload:</span> {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Heavy - approximately 7+ hours per week' : 
                              'Moderate - approximately 4-5 hours per week') : 
                            (activeStudent.recommendedCourse.split(' ')[1] === 'HL' ? 
                              'Heavy - approximately 6-7 hours per week' : 
                              'Moderate - approximately 3-4 hours per week')
                          }</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Personalized Advice
                      </h5>
                      <p className="text-blue-900">
                        This student should consider {activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 
                          'strengthening their algebraic manipulation skills and exploring mathematical proofs. Recommending additional practice with abstract problem-solving.' : 
                          'developing their data analysis and technology skills. Recommending applied mathematics practice focused on real-world contexts.'}                         
                        {activeStudent.confidenceScore < 75 ? 
                          ' The moderate confidence score suggests the student may benefit from additional support and practice before committing to this pathway.' : 
                          ' The high confidence score suggests this student is well-suited for this pathway and should excel with proper support.'}                         
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Question Analysis */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-800">Detailed Question Analysis</h4>
                    <div className="text-sm text-gray-500">{Object.keys(activeStudent.answers).length} questions answered</div>
                  </div>
                  <div className="p-5">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student's Response</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicates</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(activeStudent.answers).map(([question, answer], index) => {
                            // Extract category from question ID (assuming format like "career_field1" or "learning_style2")
                            const category = question.includes('_') ? 
                              question.split('_')[0].replace(/\b\w/g, l => l.toUpperCase()) : 
                              'General';
                              
                            // Format the answer text
                            const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
                            
                            // Determine what this answer indicates
                            const indication = (() => {
                              if (answerText.includes('aa')) return 'Preference for Analysis & Approaches';
                              if (answerText.includes('ai')) return 'Preference for Applications & Interpretation';
                              if (answerText.includes('hl')) return 'Comfort with Higher Level';
                              if (answerText.includes('sl')) return 'Preference for Standard Level';
                              return 'General preference';
                            })();
                            
                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {question.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {category}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {answerText.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    indication.includes('Analysis') ? 'bg-green-100 text-green-800' : 
                                    indication.includes('Applications') ? 'bg-blue-100 text-blue-800' :
                                    indication.includes('Higher') ? 'bg-purple-100 text-purple-800' :
                                    indication.includes('Standard') ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {indication}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Comparative Analysis */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                  <div className="p-4 border-b">
                    <h4 className="text-lg font-semibold text-gray-800">Comparative Analysis</h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Course Comparison</h5>
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                Analysis & Approaches
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block text-green-600">
                                {activeStudent.recommendedCourse.includes('AA') ? 
                                  `${Math.round(70 + Math.random() * 20)}%` : 
                                  `${Math.round(30 + Math.random() * 30)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                            <div style={{ width: activeStudent.recommendedCourse.includes('AA') ? 
                              `${Math.round(70 + Math.random() * 20)}%` : 
                              `${Math.round(30 + Math.random() * 30)}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                          </div>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Applications & Interpretation
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {activeStudent.recommendedCourse.includes('AI') ? 
                                  `${Math.round(70 + Math.random() * 20)}%` : 
                                  `${Math.round(30 + Math.random() * 30)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div style={{ width: activeStudent.recommendedCourse.includes('AI') ? 
                              `${Math.round(70 + Math.random() * 20)}%` : 
                              `${Math.round(30 + Math.random() * 30)}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Level Comparison</h5>
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                                Higher Level
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block text-purple-600">
                                {activeStudent.recommendedCourse.includes('HL') ? 
                                  `${Math.round(70 + Math.random() * 20)}%` : 
                                  `${Math.round(30 + Math.random() * 30)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                            <div style={{ width: activeStudent.recommendedCourse.includes('HL') ? 
                              `${Math.round(70 + Math.random() * 20)}%` : 
                              `${Math.round(30 + Math.random() * 30)}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                          </div>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                Standard Level
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block text-yellow-600">
                                {activeStudent.recommendedCourse.includes('SL') ? 
                                  `${Math.round(70 + Math.random() * 20)}%` : 
                                  `${Math.round(30 + Math.random() * 30)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                            <div style={{ width: activeStudent.recommendedCourse.includes('SL') ? 
                              `${Math.round(70 + Math.random() * 20)}%` : 
                              `${Math.round(30 + Math.random() * 30)}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Overall Analysis</h5>
                      <p className="text-gray-600">
                        This student shows a clear preference for <span className="font-medium">{activeStudent.recommendedCourse.split(' ')[0] === 'AA' ? 'Analysis & Approaches' : 'Applications & Interpretation'}</span> 
                        at the <span className="font-medium">{activeStudent.recommendedCourse.split(' ')[1]}</span> level.
                        The confidence score of <span className="font-medium">{activeStudent.confidenceScore}%</span> indicates
                        {activeStudent.confidenceScore > 85 ? ' a very strong match with this recommendation.' : 
                          activeStudent.confidenceScore > 70 ? ' a good match with this recommendation.' : 
                          activeStudent.confidenceScore > 60 ? ' a reasonable match, though the student might benefit from additional guidance.' : 
                          ' that the student may need additional support or might consider exploring alternative options.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write('<html><head><title>Student Analysis Report</title>');
                        printWindow.document.write('<style>body{font-family:Arial;margin:20px;} h1,h2,h3,h4{color:#333;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f2f2f2;}</style>');
                        printWindow.document.write('</head><body>');
                        printWindow.document.write(`<h1>Student Analysis Report: ${activeStudent.name}</h1>`);
                        printWindow.document.write(`<p><strong>Email:</strong> ${activeStudent.email}</p>`);
                        printWindow.document.write(`<p><strong>Date:</strong> ${new Date(activeStudent.timestamp).toLocaleString()}</p>`);
                        printWindow.document.write(`<p><strong>Recommended Course:</strong> ${activeStudent.recommendedCourse}</p>`);
                        printWindow.document.write(`<p><strong>Confidence Score:</strong> ${activeStudent.confidenceScore}%</p>`);
                        printWindow.document.write('<h2>Question Responses</h2>');
                        printWindow.document.write('<table><tr><th>Question</th><th>Response</th></tr>');
                        Object.entries(activeStudent.answers).forEach(([question, answer]) => {
                          printWindow.document.write(`<tr><td>${question.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td><td>${Array.isArray(answer) ? answer.join(', ') : answer}</td></tr>`);
                        });
                        printWindow.document.write('</table>');
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;