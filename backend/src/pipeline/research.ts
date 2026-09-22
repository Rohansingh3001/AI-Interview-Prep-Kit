import { generateStructured, generateText } from '../llm/client';
const companyBriefSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    what_they_do: { type: "string" }
  },
  required: ["summary", "what_they_do"],
  additionalProperties: false
};

export const synthesizeCompanyResearch = async (pagesData: { url: string; text: string }[]) => {
  const combinedText = pagesData.map(p => `--- Source: ${p.url} ---\n${p.text.substring(0, 5000)}`).join('\n\n');
  
  const prompt = `Based on the following pages from a company's website, provide a concise summary of the company and a description of what they do.
  
  Company Data:
  ${combinedText}`;

  const result = await generateStructured(prompt, companyBriefSchema);
  return {
    ...result,
    sources: pagesData.map(p => p.url)
  };
};

export const researchHiringProcess = async (pagesData: { url: string; text: string }[], companyName: string) => {
  const combinedText = pagesData.map(p => `--- Source: ${p.url} ---\n${p.text.substring(0, 5000)}`).join('\n\n');
  
  const prompt = `Based on the following pages from ${companyName}'s website, identify any information about their hiring process, careers, or engineering recruitment. 
  If no information is found, return "Hiring process information was not found."
  
  Company Data:
  ${combinedText}`;

  const result = await generateText(prompt);
  return result;
};
