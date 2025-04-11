interface Results {
  course: 'AA' | 'AI';
  level: 'HL' | 'SL';
  confidence: number;
  details: {
    focus: string;
    style: string;
    advice: string;
  };
  scores: {
    aa: number;
    ai: number;
    hl: number;
    sl: number;
    aaPercent: number;
    aiPercent: number;
    hlPercent: number;
    slPercent: number;
    courseConfidence: number;
    levelConfidence: number;
    compatibility: number;
    sectionScores: {
      career: { aa: number, ai: number, hl: number, sl: number },
      interest: { aa: number, ai: number, hl: number, sl: number },
      skill: { aa: number, ai: number, hl: number, sl: number },
      learning: { aa: number, ai: number, hl: number, sl: number },
      future: { aa: number, ai: number, hl: number, sl: number }
    },
    psychometricProfile: {
      abstraction: number,
      application: number,
      computation: number,
      visualization: number,
      persistence: number
    },
    zScores: {
      aa: number,
      ai: number,
      hl: number,
      sl: number
    }
  };
}

export function calculateResults(answers: Record<string, string[]>): Results {
  let aaScore = 0;
  let aiScore = 0;
  let hlScore = 0;
  let slScore = 0;
  
  // Track the number of selections for each category to calculate normalized scores
  let aaCount = 0;
  let aiCount = 0;
  let hlCount = 0;
  let slCount = 0;

  // Calculate scores based on multiple answers per question
  Object.values(answers).forEach(answerArray => {
    // Calculate weights based on number of selections for this question
    // This ensures that if a student selects multiple options, they don't unfairly influence the score
    const selectionWeight = 1 / Math.max(1, answerArray.length);
    
    // Process each selected option within the question
    answerArray.forEach(answer => {
      if (answer.includes('aa_')) {
        aaScore += selectionWeight;
        aaCount++;
      }
      if (answer.includes('ai_')) {
        aiScore += selectionWeight;
        aiCount++;
      }
      if (answer.includes('_hl')) {
        hlScore += selectionWeight;
        hlCount++;
      }
      if (answer.includes('_sl')) {
        slScore += selectionWeight;
        slCount++;
      }
    });
  });

  // Calculate the total number of questions answered
  const totalQuestions = Object.keys(answers).length;
  
  // Calculate normalized percentages (what proportion of the max possible score)
  const aaPercent = (aaScore / totalQuestions) * 100;
  const aiPercent = (aiScore / totalQuestions) * 100;
  const hlPercent = (hlScore / totalQuestions) * 100;
  const slPercent = (slScore / totalQuestions) * 100;
  
  // Determine course and level with a slight bias towards SL 
  // (psychologically sounder to recommend SL unless there's a clear HL preference)
  const course = aaScore > aiScore ? 'AA' : 'AI';
  const level = hlScore > slScore * 1.1 ? 'HL' : 'SL'; // 10% bias towards SL for safety
  
  // Calculate dominance ratios (how much one option outweighs the other)
  // This helps measure the strength of preference
  const aaTotalRatio = aaCount ? aaScore / aaCount : 0;
  const aiTotalRatio = aiCount ? aiScore / aiCount : 0;
  const hlTotalRatio = hlCount ? hlScore / hlCount : 0;
  const slTotalRatio = slCount ? slScore / slCount : 0;
  
  // Calculate confidence metrics - how decisive is the preference?
  const aaDominance = aaScore - aiScore;
  const hlDominance = hlScore - slScore;
  
  // Calculate separate confidence levels for course and level choices
  // Confidence increases with the difference between scores
  const courseConfidence = Math.min(100, Math.max(50, 50 + (aaDominance / totalQuestions) * 100));
  const levelConfidence = Math.min(100, Math.max(50, 50 + (hlDominance / totalQuestions) * 100));
  
  // Overall confidence is a weighted average of course and level confidence
  const confidence = Math.round(courseConfidence * 0.5 + levelConfidence * 0.5);

  // Generate detailed feedback based on results
  const details = {
    focus: getFocusDescription(course, level),
    style: getLearningStyleDescription(course, level, aaPercent, aiPercent, hlPercent, slPercent),
    advice: getAdvice(
      confidence, 
      course, 
      level, 
      courseConfidence, 
      levelConfidence, 
      aaScore, 
      aiScore, 
      hlScore, 
      slScore,
      totalQuestions
    )
  };

  return { 
    course, 
    level, 
    confidence, 
    details,
    scores: {
      aa: aaScore,
      ai: aiScore,
      hl: hlScore,
      sl: slScore,
      aaPercent,
      aiPercent,
      hlPercent,
      slPercent,
      courseConfidence,
      levelConfidence
    }
  };
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

function getLearningStyleDescription(
  course: 'AA' | 'AI', 
  level: 'HL' | 'SL',
  aaPercent: number,
  aiPercent: number,
  hlPercent: number,
  slPercent: number
): string {
  // Determine strength of preference for personalized feedback
  const coursePreferenceStrength = Math.abs(aaPercent - aiPercent);
  const levelPreferenceStrength = Math.abs(hlPercent - slPercent);
  
  const strongPreference = coursePreferenceStrength > 30 || levelPreferenceStrength > 30;
  const moderatePreference = coursePreferenceStrength > 15 || levelPreferenceStrength > 15;
  
  let stylePrefix = '';
  
  if (strongPreference) {
    stylePrefix = 'Your responses consistently show that ';
  } else if (moderatePreference) {
    stylePrefix = 'Your responses suggest that ';
  } else {
    stylePrefix = 'Based on your responses, it appears that ';
  }
  
  if (course === 'AA') {
    return level === 'HL'
      ? `${stylePrefix}you have strong analytical skills and enjoy discovering mathematical patterns and proofs. You appreciate theoretical foundations and abstract thinking, and likely have the dedication needed for a challenging mathematics course.`
      : `${stylePrefix}you value mathematical structure but prefer a more guided approach to learning. You can handle abstract concepts but may prefer seeing more direct applications. AA SL would provide a good balance of theory and practice for your learning style.`;
  } else {
    return level === 'HL'
      ? `${stylePrefix}you excel at connecting mathematics to real-world scenarios and enjoy working with data and models. Your strength lies in applying mathematical concepts to practical situations and using technology effectively to solve complex problems.`
      : `${stylePrefix}you learn best when mathematics is presented in practical, concrete contexts. You prefer technology-based approaches and appreciate seeing the relevance of mathematics in everyday situations. AI SL provides valuable mathematical tools with approachable levels of abstraction.`;
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
  slScore: number,
  totalQuestions: number
): string {
  let advice = '';
  
  // Calculate how balanced the preferences are
  const courseBalanceIndex = Math.abs(aaScore - aiScore);
  const levelBalanceIndex = Math.abs(hlScore - slScore);
  
  // Determine if preferences are mixed or clear
  // Adjust threshold based on total questions to be more proportional
  const threshold = Math.max(2, totalQuestions * 0.2); // At least 20% difference for clear preference
  const isCourseMixed = courseBalanceIndex < threshold;
  const isLevelMixed = levelBalanceIndex < threshold;
  
  // Alternative course and level options to consider
  const altCourse = course === 'AA' ? 'AI' : 'AA';
  const altLevel = level === 'HL' ? 'SL' : 'HL';
  
  // Course descriptions for clarity
  const courseNames = {
    'AA': 'Analysis & Approaches',
    'AI': 'Applications & Interpretation'
  };

  if (confidence >= 75) {
    advice = `Your responses strongly indicate that Mathematics: ${courseNames[course]} ${level} aligns well with your interests and abilities. The high confidence level (${confidence}%) suggests this would be an excellent choice for you.`;
    
    // Add specific strength points based on course and level
    if (course === 'AA' && level === 'HL') {
      advice += ` You demonstrate a strong affinity for theoretical mathematics and abstract thinking, which are essential for success in this challenging course.`;
    } else if (course === 'AA' && level === 'SL') {
      advice += ` You show good understanding of mathematical concepts while maintaining a balanced approach that would work well with this course's combination of theory and application.`;
    } else if (course === 'AI' && level === 'HL') {
      advice += ` Your strength in practical applications and data analysis would serve you well in this course's focus on mathematical modeling and technology.`;
    } else {
      advice += ` Your preference for seeing mathematics in context and using technology to solve problems matches well with this course's approach.`;
    }
  } else if (confidence >= 60) {
    advice = `Mathematics: ${courseNames[course]} ${level} appears to be a good fit, but consider discussing this choice with your teachers. `;
    
    if (courseConfidence > levelConfidence) {
      advice += `You show a clear preference for ${courseNames[course]} mathematics (${Math.round(courseConfidence)}% confidence), but you might want to discuss whether ${level} or ${altLevel} is the right level for you.`;
    } else {
      advice += `You show a clear preference for ${level} level (${Math.round(levelConfidence)}% confidence), but you might want to explore both ${courseNames['AA']} and ${courseNames['AI']} options at this level.`;
    }
  } else {
    advice = 'Your responses show mixed preferences. We recommend discussing your options with your math teacher and academic advisor. ';
    
    if (isCourseMixed && !isLevelMixed) {
      advice += `You seem to have a clearer preference for the ${level} level, but are less decided between the ${courseNames['AA']} and ${courseNames['AI']} approaches.`;
    } else if (!isCourseMixed && isLevelMixed) {
      advice += `You seem to prefer the ${courseNames[course]} approach to mathematics, but are less decided about whether HL or SL would be better for you.`;
    } else {
      advice += 'Consider factors like:';
      advice += '\n• Your university and career plans';
      advice += '\n• Your comfort with abstract vs. applied mathematics';
      advice += '\n• The time you can dedicate to mathematics study';
      advice += '\n• Your performance and enjoyment in previous mathematics courses';
    }
  }

  return advice;
}