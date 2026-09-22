import { Request, Response } from 'express';
import PracticeSession from '../models/PracticeSession';

export const savePractice = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { flashcardId, confidence, duration } = req.body;
    
    const session = new PracticeSession({
      userId: req.userId,
      kitId: id,
      flashcardId,
      confidence,
      duration
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

import { generateStructured } from '../llm/client';
import { evaluationSchema } from '../llm/schemas/evaluation.schema';

export const evaluateAnswer = async (req: any, res: Response): Promise<void> => {
  try {
    const { question, suggestedAnswer, keyPoints, userAnswer } = req.body;
    
    if (!userAnswer || userAnswer.trim() === '') {
      res.status(400).json({ error: 'No answer provided' });
      return;
    }

    const prompt = `You are an expert AI interviewer. The user was asked the following interview question:
Question: "${question}"

Suggested Ideal Answer:
${suggestedAnswer}

Key Points to Hit:
${keyPoints?.join('\n') || 'None provided'}

The user provided the following transcribed spoken answer:
"${userAnswer}"

Evaluate the user's spoken answer. Provide a score out of 10, positive feedback, and areas for improvement.`;

    const evaluation = await generateStructured(prompt, evaluationSchema);
    
    res.status(200).json(evaluation);
  } catch (error: any) {
    console.error("Evaluation failed:", error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
};
