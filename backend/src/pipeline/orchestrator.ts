import { extractJobDescription } from './extraction';
import { crawlCompany } from './crawling';
import { synthesizeCompanyResearch, researchHiringProcess } from './research';
import { generateQuestions, generateMissingQuestions, generateFlashcards } from './question-generation';
import { checkCoverage } from './coverage';
import { generateSchedule } from './scheduling';

export const buildInterviewKit = async (jdText: string, companyUrl: string, daysAvailable: number) => {
  try {
    // 1. Requirement Extraction
    const extractionResult = await extractJobDescription(jdText);
    const role = extractionResult.role;
    
    // 2. Company Research
    const pagesData = await crawlCompany(companyUrl);
    
    // 3. Synthesis
    const companyBrief = await synthesizeCompanyResearch(pagesData);
    const hiringProcess = await researchHiringProcess(pagesData, companyBrief.summary);
    
    // 4. Question Generation
    let questions = await generateQuestions(role, companyBrief, hiringProcess);
    
    // 5. Coverage Validation
    let coverage = checkCoverage(role.requirements, questions);
    let passes = 1;
    
    // 6. Gap Detection & Additional Generation
    const maxPasses = 2;
    while (coverage.uncovered_requirement_ids.length > 0 && passes < maxPasses) {
      const additionalQuestions = await generateMissingQuestions(role, coverage.uncovered_requirement_ids);
      questions = questions.concat(additionalQuestions);
      coverage = checkCoverage(role.requirements, questions);
      passes++;
    }
    
    // 7. Flashcards
    const flashcards = await generateFlashcards(role, questions);
    
    // 8. Schedule
    const schedule = generateSchedule(daysAvailable, questions, role.requirements);
    
    // 9. Assemble Output
    return {
      source: {
        company: companyBrief.summary.substring(0, 50),
        company_url: companyUrl,
        role: role.title,
        location: "Remote/Office", // Defaulting as not extracted
        jd_chars: jdText.length,
        researched_at: new Date().toISOString(),
        pages_used: companyBrief.sources
      },
      company_brief: companyBrief,
      role: role,
      questions: questions,
      flashcards: flashcards,
      schedule: schedule,
      coverage: {
        uncovered_requirement_ids: coverage.uncovered_requirement_ids,
        passes: passes
      }
    };
  } catch (error) {
    console.error("Pipeline failed:", error);
    throw error;
  }
};
