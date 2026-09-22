export const generateSchedule = (daysAvailable: number, questions: any[], requirements: any[]) => {
  const schedule: any[] = [];
  
  // Sort questions by difficulty descending
  const sortedQuestions = [...questions].sort((a, b) => b.difficulty - a.difficulty);
  
  const qPerDay = Math.ceil(sortedQuestions.length / (daysAvailable || 1));
  
  for (let i = 0; i < daysAvailable; i++) {
    const dayQuestions = sortedQuestions.slice(i * qPerDay, (i + 1) * qPerDay);
    const questionIds = dayQuestions.map(q => q.id);
    
    // Assign a focus based on the primary category or requirement
    const categories = dayQuestions.map(q => q.category);
    let primaryCategory = "General Practice";
    if (categories.length > 0) {
      primaryCategory = categories.sort((a, b) =>
          categories.filter(v => v === a).length - categories.filter(v => v === b).length
      ).pop() || "General Practice";
    }

    schedule.push({
      day: i + 1,
      focus: `Focus on ${primaryCategory.replace('-', ' ')}`,
      question_ids: questionIds,
      minutes: dayQuestions.length > 0 ? dayQuestions.length * 15 : 60
    });
  }

  return {
    days_available: daysAvailable,
    days: schedule
  };
};
