interface Results {
  course: 'AA' | 'AI';
  level: 'HL' | 'SL';
  confidence: number;
  details: {
    focus: string;
    style: string;
    advice: string;
  };
}

export function calculateResults(answers: Record<string, string[]>): Results {
  let aaScore = 0;
  let aiScore = 0;
  let hlScore = 0;
  let slScore = 0;

  // Calculate scores based on multiple answers per question
  Object.values(answers).forEach(answerArray => {
    // Process each selected option within the question
    answerArray.forEach(answer => {
      // Apply weighted scoring based on how many options were selected
      const weight = 1; // Each selection gets 1 point (max 2 per question)
      
      if (answer.includes('aa_')) aaScore += weight;
      if (answer.includes('ai_')) aiScore += weight;
      if (answer.includes('_hl')) hlScore += weight;
      if (answer.includes('_sl')) slScore += weight;
    });
  });

  // Determine course and level
  const course = aaScore > aiScore ? 'AA' : 'AI';
  const level = hlScore > slScore ? 'HL' : 'SL';
  
  // Calculate confidence percentage - adjusted for multiple selection
  const totalQuestions = Object.keys(answers).length;
  
  // Max possible score is now 2 points per question (if student selects 2 options of same type)
  const maxPossibleScore = totalQuestions * 2;
  
  // Calculate confidence metrics
  const aaDominance = aaScore - aiScore;
  const hlDominance = hlScore - slScore;
  
  // Calculate separate confidences for course and level
  // Higher differential means higher confidence
  const courseConfidence = Math.min(100, Math.max(50, 50 + (aaDominance / maxPossibleScore) * 100));
  const levelConfidence = Math.min(100, Math.max(50, 50 + (hlDominance / maxPossibleScore) * 100));
  
  // Overall confidence reflects how decisive the scores are
  const confidence = Math.round((courseConfidence + levelConfidence) / 2);

  // Generate detailed feedback
  const details = {
    focus: getFocusDescription(course, level),
    style: getLearningStyleDescription(course, level),
    advice: getAdvice(confidence, course, level, courseConfidence, levelConfidence, aaScore, aiScore, hlScore, slScore)
  };

  return { course, level, confidence, details };
}

function getFocusDescription(course: 'AA' | 'AI', level: 'HL' | 'SL'): string {
  if (course === 'AA') {
    return level === 'HL'
      ? 'Strong emphasis on pure mathematics, proofs, and abstract thinking. This course is ideal for future mathematicians, physicists, or engineers who need deep theoretical understanding.'
      : 'Balance of theoretical mathematics with practical applications. Provides a good foundation for STEM fields while maintaining a manageable workload.';
  } else {
    return level === 'HL'
      ? 'Deep dive into real-world applications, modeling, and data analysis. Perfect for future economists, business analysts, or social scientists who need strong applied mathematics skills.'
      : 'Practical approach to mathematics focusing on modeling and technology. Suitable for students needing mathematical literacy in non-STEM fields.';
  }
}

function getLearningStyleDescription(course: 'AA' | 'AI', level: 'HL' | 'SL'): string {
  if (course === 'AA') {
    return level === 'HL'
      ? 'Your responses indicate strong analytical skills and enjoyment in discovering mathematical patterns and proofs. You tend to appreciate the theoretical foundations of mathematics.'
      : 'You show an appreciation for mathematical structure but prefer a more guided approach to learning. This suggests AA SL would provide the right balance of theory and practice.';
  } else {
    return level === 'HL'
      ? 'You excel at connecting mathematics to real-world scenarios and enjoy working with data. Your strength lies in applying mathematical concepts to practical situations.'
      : 'You learn best when mathematics is presented in practical, concrete contexts. AI SL would provide you with useful mathematical tools while maintaining a manageable level of abstraction.';
  }
}

function getAdvice(
  confidence: number,
  course: 'AA' | 'AI',
  level: 'HL' | 'SL',
  courseConfidence: number,
  levelConfidence: number,
  aaScore: number,
  aiScore: number,
  hlScore: number,
  slScore: number
): string {
  let advice = '';
  
  // Calculate how balanced the preferences are
  const courseBalanceIndex = Math.abs(aaScore - aiScore);
  const levelBalanceIndex = Math.abs(hlScore - slScore);
  
  // Higher number means more decisive preference
  const isCourseMixed = courseBalanceIndex < 5;
  const isLevelMixed = levelBalanceIndex < 5;

  if (confidence >= 75) {
    advice = `Your responses strongly indicate that ${course} ${level} aligns well with your interests and abilities. The high confidence level (${confidence}%) suggests this would be an excellent choice for you.`;
  } else if (confidence >= 60) {
    advice = `${course} ${level} appears to be a good fit, but consider discussing this choice with your teachers. `;
    
    if (courseConfidence > levelConfidence) {
      advice += `You show a preference for ${course} mathematics, but you might want to discuss whether ${level} is the right level for you.`;
    } else {
      advice += `You show a preference for ${level} level, but you might want to explore both AA and AI options at this level.`;
    }
  } else {
    advice = 'Your responses show mixed preferences. We recommend discussing your options with your math teacher and academic advisor. ';
    
    if (isCourseMixed && !isLevelMixed) {
      advice += `You seem to have a clearer preference for the ${level} level, but are less decided between the AA and AI approaches.`;
    } else if (!isCourseMixed && isLevelMixed) {
      advice += `You seem to prefer the ${course} approach to mathematics, but are less decided about whether HL or SL would be better for you.`;
    } else {
      advice += 'Consider factors like:';
      advice += '\n• Your university and career plans';
      advice += '\n• Your comfort with abstract vs. applied mathematics';
      advice += '\n• The time you can dedicate to mathematics study';
    }
  }

  return advice;
}