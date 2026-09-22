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
