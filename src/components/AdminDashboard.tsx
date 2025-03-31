import React, { useState } from 'react';
import { Download, LogOut, Search, Users, ChevronDown, Filter } from 'lucide-react';

// Tipo para representar um registro de estudante
interface StudentRecord {
  id: string;
  name: string;
  email: string;
  timestamp: string;
  recommendedCourse: string;
  confidenceScore: number;
  answers: Record<string, string>;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // Mock data - normalmente seria carregado via API
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.j@stfrancis.com.br',
      timestamp: '2025-03-25T14:32:00Z',
      recommendedCourse: 'AA HL',
      confidenceScore: 87,
      answers: { career_field1: 'aa_hl', skill1: 'aa_hl' }
    },
    {
      id: '2',
      name: 'Bruno Santos',
      email: 'bruno.s@stfrancis.com.br',
      timestamp: '2025-03-25T15:45:00Z',
      recommendedCourse: 'AI SL',
      confidenceScore: 92,
      answers: { career_field1: 'ai_sl', skill1: 'ai_sl' }
    },
    {
      id: '3',
      name: 'Carla Martinez',
      email: 'carla.m@stfrancis.com.br',
      timestamp: '2025-03-26T10:15:00Z',
      recommendedCourse: 'AI HL',
      confidenceScore: 78,
      answers: { career_field1: 'ai_hl', skill1: 'ai_hl' }
    },
    {
      id: '4',
      name: 'Daniel Oliveira',
      email: 'daniel.o@stfrancis.com.br',
      timestamp: '2025-03-26T11:20:00Z',
      recommendedCourse: 'AA SL',
      confidenceScore: 81,
      answers: { career_field1: 'aa_sl', skill1: 'aa_sl' }
    },
    {
      id: '5',
      name: 'Eduarda Costa',
      email: 'eduarda.c@stfrancis.com.br',
      timestamp: '2025-03-26T13:05:00Z',
      recommendedCourse: 'AA HL',
      confidenceScore: 94,
      answers: { career_field1: 'aa_hl', skill1: 'aa_hl' }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string | null>(null);

  // Filtrar os estudantes
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse ? student.recommendedCourse === filterCourse : true;
    
    return matchesSearch && matchesCourse;
  });

  // Exportar dados como CSV
  const exportToCSV = () => {
    // Cabeçalhos
    const headers = ['ID', 'Name', 'Email', 'Date', 'Recommended Course', 'Confidence Score'];
    
    // Converter dados para formato CSV
    const csvRows = [
      headers.join(','),
      ...filteredStudents.map(student => {
        return [
          student.id,
          `"${student.name}"`,
          student.email,
          new Date(student.timestamp).toLocaleDateString(),
          student.recommendedCourse,
          student.confidenceScore
        ].join(',');
      })
    ];
    
    // Criar blob e download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ib-maths-assessments-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <h1 className="text-xl font-bold text-gray-900">IB Maths Choice Admin</h1>
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
              
              <div className="w-full md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="focus:ring-school-navy focus:border-school-navy block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filterCourse || ''}
                    onChange={(e) => setFilterCourse(e.target.value || null)}
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
              
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-school-navy hover:bg-school-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-navy"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
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
                      <button className="text-school-red hover:text-school-dark-red">
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
      </main>
    </div>
  );
};

export default AdminDashboard;