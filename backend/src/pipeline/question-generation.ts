import { generateStructured } from '../llm/client';
import { questionsSchema } from '../llm/schemas/questions.schema';
import { flashcardsSchema } from '../llm/schemas/flashcards.schema';

export const generateQuestions = async (role: any, companyBrief: any, hiringProcess: string) => {
  const prompt = `Generate a comprehensive list of interview questions based on the following context.
  
  Role: ${JSON.stringify(role, null, 2)}
  Company: ${JSON.stringify(companyBrief, null, 2)}
  Hiring Process Insight: ${hiringProcess}
  
  Ensure questions reference the requirement IDs from the role.
  Categories should be technical, behavioural, system-design, or company-fit.
  Difficulty should be 1 (Easy), 2 (Medium), or 3 (Hard).`;

  const result = await generateStructured(prompt, questionsSchema);
  return result.questions || [];
};

export const generateMissingQuestions = async (role: any, uncoveredIds: string[]) => {
  const prompt = `Generate interview questions specifically targeting the following uncovered requirement IDs: ${uncoveredIds.join(', ')}.
  
  Role Requirements: ${JSON.stringify(role.requirements.filter((r: any) => uncoveredIds.includes(r.id)), null, 2)}
  
  Ensure new questions reference the requirement IDs.
  Categories should be technical, behavioural, system-design, or company-fit.
  Difficulty should be 1 (Easy), 2 (Medium), or 3 (Hard).`;

  const result = await generateStructured(prompt, questionsSchema);
  return result.questions || [];
}

export const generateFlashcards = async (role: any, questions: any[]) => {
  const prompt = `Generate a set of study flashcards for the interview preparation.
  
  Role Requirements: ${JSON.stringify(role.requirements, null, 2)}
  Questions Generated: ${JSON.stringify(questions, null, 2)}
  
  Ensure flashcards reference the requirement IDs.
  A flashcard should have a concise 'front' (question or concept) and a clear 'back' (answer or explanation).`;

  const result = await generateStructured(prompt, flashcardsSchema);
  return result.flashcards || [];
};
