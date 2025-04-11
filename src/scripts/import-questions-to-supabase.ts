import { supabase } from '../services/supabase';
import { questions } from '../data/questions';

/**
 * Este script importa todas as perguntas do arquivo questions.ts para o Supabase
 * Pode ser executado com: npx ts-node src/scripts/import-questions-to-supabase.ts
 */

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface QuestionWithSection extends Question {
  section: string;
}

// Mapeamento das seções com base nas perguntas
const SECTIONS = [
  { 
    title: 'Career & Future Path',
    questions: questions.slice(0, 5),
  },
  { 
    title: 'Interest & Enjoyment',
    questions: questions.slice(5, 10),
  },
  { 
    title: 'Skills & Confidence',
    questions: questions.slice(10, 15),
  },
  { 
    title: 'Learning Style',
    questions: questions.slice(15, 20),
  },
  { 
    title: 'Future Goals',
    questions: questions.slice(20, 25),
  }
];

// Preparar as questões com suas respectivas seções
const questionsWithSections: QuestionWithSection[] = [];

SECTIONS.forEach(section => {
  section.questions.forEach(question => {
    questionsWithSections.push({
      ...question,
      section: section.title
    });
  });
});

// Função principal para importar as questões
async function importQuestions() {
  console.log(`Iniciando importação de ${questionsWithSections.length} questões para o Supabase...`);
  
  // Para cada questão, tente inserir ou atualizar
  for (const question of questionsWithSections) {
    try {
      const { data, error } = await supabase
        .from('questoes')
        .upsert({
          id: question.id,
          text: question.text,
          section: question.section,
          options: question.options
        }, {
          onConflict: 'id'
        });
      
      if (error) {
        console.error(`Erro ao importar questão ${question.id}:`, error);
      } else {
        console.log(`Questão ${question.id} importada com sucesso.`);
      }
    } catch (error) {
      console.error(`Exceção ao importar questão ${question.id}:`, error);
    }
  }
  
  console.log('Importação concluída.');
}

// Executar a função principal
importQuestions()
  .catch(error => {
    console.error('Erro ao executar o script de importação:', error);
    process.exit(1);
  })
  .finally(() => {
    // Encerrar o processo após a conclusão
    setTimeout(() => process.exit(0), 1000);
  });
