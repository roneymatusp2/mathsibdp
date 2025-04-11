import { createClient } from '@supabase/supabase-js';
import type { Tables } from './supabase';

// Credenciais do service role para operações administrativas
// Usando o service role key do projeto azhtkpetziwxgkgmkmkb para acesso completo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://azhtkpetziwxgkgmkmkb.supabase.co';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aHRrcGV0eml3eGdrZ21rbWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI1MTc2NSwiZXhwIjoyMDU5ODI3NzY1fQ.Xf5eurVQ5Z8XTptFFZdlzRow9pqBYjvOYDnNKOr5ylU';

// Cliente para operações administrativas (uso apenas em contexto seguro)
export const supabaseAdmin = createClient<Tables>(supabaseUrl, supabaseServiceKey);

// Funções administrativas

// Obter todas as escolas cadastradas
export const getAllSchools = async () => {
  try {
    // Em um cenário real, isso seria uma tabela separada
    // Para este exemplo, estamos extraindo escolas únicas dos emails de estudantes
    const { data: questionarios, error } = await supabaseAdmin
      .from('questionarios')
      .select('email')
      .order('email');
      
    if (error) throw error;
    
    // Extrair domínios de email únicos para inferir escolas
    const schoolDomains = new Set<string>();
    questionarios?.forEach(q => {
      const domain = q.email.split('@')[1];
      if (domain) schoolDomains.add(domain);
    });
    
    return Array.from(schoolDomains).map((domain, index) => ({
      id: `school_${index + 1}`,
      name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
      domain: domain
    }));
  } catch (error) {
    console.error('Erro ao buscar escolas:', error);
    return [];
  }
};

// Obter estatísticas do sistema
export const getSystemStats = async () => {
  try {
    // Total de questionários
    const { count: totalQuestionarios, error: countError } = await supabaseAdmin
      .from('questionarios')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    
    // Contagem por curso recomendado
    const { data: courseStats, error: coursesError } = await supabaseAdmin
      .from('questionarios')
      .select('recommended_course')
      .order('recommended_course');
      
    if (coursesError) throw coursesError;
    
    // Calcular totais por curso
    const courseCount: Record<string, number> = {};
    courseStats?.forEach(item => {
      const course = item.recommended_course;
      courseCount[course] = (courseCount[course] || 0) + 1;
    });
    
    // Últimos 5 questionários
    const { data: recentEntries, error: recentError } = await supabaseAdmin
      .from('questionarios')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);
      
    if (recentError) throw recentError;
    
    return {
      totalQuestionarios,
      courseDistribution: courseCount,
      recentEntries
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas do sistema:', error);
    return null;
  }
};

// Remover um questionário (apenas administradores devem fazer isso)
export const removeQuestionario = async (id: string) => {
  try {
    const { error } = await supabaseAdmin
      .from('questionarios')
      .delete()
      .match({ id });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao remover questionário ${id}:`, error);
    return false;
  }
};

// Exportar todos os dados (apenas para uso administrativo)
export const exportAllData = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('questionarios')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao exportar todos os dados:', error);
    return [];
  }
};