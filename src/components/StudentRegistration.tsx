import React, { useState } from 'react';
import { registerStudent, type StudentRegistration } from '../services/auth';
import { BookOpen, Mail, User, Key } from 'lucide-react';

interface StudentRegistrationProps {
  onRegistrationComplete?: (success: boolean) => void;
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onRegistrationComplete }) => {
  const [registrationData, setRegistrationData] = useState<StudentRegistration>({
    name: '',
    email: '',
    registrationCode: '',
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
    
    if (!registrationData.registrationCode.trim()) {
      setError('Por favor, informe seu código de registro');
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
  
  if (success) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg mx-auto border border-indigo-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">Registro concluído com sucesso!</h3>
          <p className="mt-2 text-gray-600">
            {registrationData.sendResults
              ? `Enviaremos seus resultados para ${registrationData.email} após a conclusão do questionário.`
              : 'Você optou por não receber os resultados por email.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all"
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
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg mx-auto border border-indigo-100">
      <div className="text-center mb-6">
        <div className="h-16 w-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Registro do Estudante</h2>
        <p className="mt-2 text-gray-600">
          Preencha suas informações para começar o questionário do IB Maths Choice
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome completo
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-gray-900 border-gray-300 rounded-lg"
              value={registrationData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-gray-900 border-gray-300 rounded-lg"
              value={registrationData.email}
              onChange={handleChange}
              placeholder="seu.email@exemplo.com"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Usaremos seu email apenas para enviar os resultados do questionário, se você optar por isso.
          </p>
        </div>
        
        <div>
          <label htmlFor="registrationCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código de Registro
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="registrationCode"
              name="registrationCode"
              type="text"
              required
              className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-gray-900 border-gray-300 rounded-lg uppercase"
              value={registrationData.registrationCode}
              onChange={handleChange}
              placeholder="REG-MATH-XXXXX"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Informe o código de registro fornecido pela sua escola para acessar o questionário.
          </p>
        </div>
        
        <div className="flex items-start pt-2">
          <div className="flex items-center h-5">
            <input
              id="sendResults"
              name="sendResults"
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
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
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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