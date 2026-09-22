import { generateStructured } from '../llm/client';
import { extractionSchema } from '../llm/schemas/extraction.schema';

export const extractJobDescription = async (jdText: string) => {
  const prompt = `You are an expert HR analyst and technical recruiter. 
  Extract the structured details from the following job description.
  Assign stable, unique IDs to each requirement (e.g., r1, r2, r3).
  Determine if the requirement is technical, behavioural, or domain specific.
  Determine if the requirement is a 'must' or 'nice' to have.
  
  Job Description:
  ${jdText}`;

  const result = await generateStructured(prompt, extractionSchema);
  return result;
};
