import React, { useState } from 'react';
import { registerStudent, type StudentRegistration } from '../services/auth';

interface StudentRegistrationProps {
  onRegistrationComplete?: (success: boolean) => void;
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onRegistrationComplete }) => {
  const [registrationData, setRegistrationData] = useState<StudentRegistration>({
    name: '',
    email: '',
    school: '',
    sendResults: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setRegistrationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!registrationData.name.trim()) {
      setError('Por favor, informe seu nome');
      return;
    }
    
    if (!registrationData.email.trim() || !registrationData.email.includes('@') || !registrationData.email.includes('.')) {
      setError('Por favor, informe um email válido');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const user = await registerStudent(registrationData);
      
      if (user) {
        setSuccess(true);
        if (onRegistrationComplete) {
          onRegistrationComplete(true);
        }
      } else {
        setError('Não foi possível completar o registro. Por favor, tente novamente.');
        if (onRegistrationComplete) {
          onRegistrationComplete(false);
        }
      }
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError('Ocorreu um erro durante o registro. Por favor, tente novamente.');
      if (onRegistrationComplete) {
        onRegistrationComplete(false);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Lista de escolas (em uma implementação real, isso seria carregado do backend)
  const schools = [
    { id: '1', name: 'St. Paul\'s School' },
    { id: '2', name: 'British College' },
    { id: '3', name: 'American School' },
    { id: '4', name: 'St. Francis College' },
    { id: '5', name: 'Escola Suíço-Brasileira' },
    { id: 'other', name: 'Outra Escola' }
  ];
  
  if (success) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Registro concluído com sucesso!</h3>
          <p className="mt-2 text-sm text-gray-500">
            {registrationData.sendResults
              ? `Enviaremos seus resultados para ${registrationData.email} após a conclusão do questionário.`
              : 'Você optou por não receber os resultados por email.'}
          </p>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-school-navy hover:bg-school-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-navy"
              onClick={() => window.location.reload()}
            >
              Continuar para o questionário
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-lg font-medium text-gray-900">Registro do Estudante</h2>
      <p className="mt-1 text-sm text-gray-500">
        Por favor, preencha suas informações para começar o questionário do IB Maths Choice.
      </p>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="shadow-sm focus:ring-school-navy focus:border-school-navy block w-full sm:text-sm border-gray-300 rounded-md"
              value={registrationData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="shadow-sm focus:ring-school-navy focus:border-school-navy block w-full sm:text-sm border-gray-300 rounded-md"
              value={registrationData.email}
              onChange={handleChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Usaremos seu email apenas para enviar os resultados do questionário, se você optar por isso.
          </p>
        </div>
        
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">
            Escola
          </label>
          <div className="mt-1">
            <select
              id="school"
              name="school"
              className="shadow-sm focus:ring-school-navy focus:border-school-navy block w-full sm:text-sm border-gray-300 rounded-md"
              value={registrationData.school}
              onChange={handleChange}
            >
              <option value="">Selecione sua escola</option>
              {schools.map(school => (
                <option key={school.id} value={school.name}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="sendResults"
              name="sendResults"
              type="checkbox"
              className="focus:ring-school-navy h-4 w-4 text-school-navy border-gray-300 rounded"
              checked={registrationData.sendResults}
              onChange={handleChange}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="sendResults" className="font-medium text-gray-700">
              Receber resultados por email
            </label>
            <p className="text-gray-500">
              Enviaremos uma cópia dos seus resultados e recomendações para seu email.
            </p>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-school-navy hover:bg-school-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-navy ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processando...' : 'Continuar para o questionário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistration;