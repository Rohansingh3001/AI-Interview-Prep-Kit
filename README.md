# AI Interview Prep Kit

## Product Overview
The AI Interview Prep Kit is a full-stack web application that helps candidates prepare for specific job interviews by generating a personalized, research-backed study plan. It automates the extraction of requirements from a job description, crawls the company's website to understand their business and hiring process, and generates tailored interview questions, flashcards, and a structured day-by-day study schedule.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS v4, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Mongoose)
- **AI**: Google Gemini (via `@google/genai`)

## Architecture
The application is split into a `frontend` and a `backend` directory. The backend uses an asynchronous task orchestration model where kit generation runs in the background. State is persisted in MongoDB.

## Setup
### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Gemini API Key

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file (see Environment Variables).
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Environment Variables
**Backend `.env`:**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-prep-kit
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## AI Pipeline
1. **Extraction**: Gemini extracts requirements, priorities (must/nice), and types from the JD.
2. **Crawling**: The `crawling.ts` module fetches the company URL, parses HTML with Cheerio, respects robots.txt, ranks internal links based on hiring keywords, and fetches up to 5 promising pages.
3. **Research Synthesis**: Gemini summarizes the company and attempts to identify hiring process information from the crawled pages.
4. **Question Generation**: Gemini generates questions mapping directly to requirement IDs.
5. **Coverage**: The backend deterministically compares requirement IDs with generated questions.
6. **Second Pass**: If "must-have" requirements are missed, a second LLM pass is triggered specifically for those missed IDs.
7. **Flashcards**: Flashcards are generated referencing requirement IDs.
8. **Scheduling**: A deterministic backend algorithm distributes the questions across the requested days, sorted by difficulty and categorized by focus.

## Batch Evaluation
To run the batch evaluator CLI:
```bash
cd backend
npm run evaluate -- --input cases.json --output kits.json
```

## Known Limitations
- Heavy reliance on the LLM's structured output adhering strictly to the JSON schema.
- The web crawler is a simple HTTP fetcher (`axios` + `cheerio`) and cannot render JavaScript-heavy SPAs (a headless browser like Puppeteer would be needed for that).
- Rate limits from Gemini or the target company's website can cause pipeline failures.

## Trade-offs
- **Separate Repos vs Monorepo**: Chose simple separate directories to avoid Turborepo/Nx overhead for this assessment, keeping it straightforward.
- **HTTP Crawling vs Headless Browser**: Chose HTTP crawling for speed and lower resource consumption, trading off SPA compatibility.
