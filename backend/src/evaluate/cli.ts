import fs from 'fs';
import path from 'path';
import { buildInterviewKit } from '../pipeline/orchestrator';
import dotenv from 'dotenv';
dotenv.config();

const runEvaluation = async () => {
  const args = process.argv.slice(2);
  const inputIdx = args.indexOf('--input');
  const outputIdx = args.indexOf('--output');
  
  if (inputIdx === -1 || outputIdx === -1 || !args[inputIdx + 1] || !args[outputIdx + 1]) {
    console.error("Usage: npm run evaluate -- --input <cases.json> --output <kits.json>");
    process.exit(1);
  }
  
  const inputFile = args[inputIdx + 1];
  const outputFile = args[outputIdx + 1];
  
  let casesData: any[];
  try {
    casesData = JSON.parse(fs.readFileSync(path.resolve(inputFile), 'utf-8'));
  } catch (err) {
    console.error("Failed to read input file:", err);
    process.exit(1);
  }
  
  const results = {
    version: "1.0",
    generated_at: new Date().toISOString(),
    kits: [] as any[]
  };
  
  for (const c of casesData) {
    console.log(`Evaluating case: ${c.id}`);
    try {
      const kit = await buildInterviewKit(c.jd, c.company_url, c.days);
      results.kits.push({
        id: c.id,
        status: 'ok',
        kit: kit,
        error: null
      });
    } catch (e: any) {
      console.error(`Error for case ${c.id}:`, e.message);
      results.kits.push({
        id: c.id,
        status: 'failed',
        kit: null,
        error: {
          code: "GENERATION_FAILED",
          message: e.message
        }
      });
    }
  }
  
  fs.writeFileSync(path.resolve(outputFile), JSON.stringify(results, null, 2));
  console.log(`Evaluation complete. Results saved to ${outputFile}`);
  process.exit(0);
};

runEvaluation();
