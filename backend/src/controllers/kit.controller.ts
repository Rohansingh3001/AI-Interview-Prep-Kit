import { Request, Response } from 'express';
import Kit from '../models/Kit';
import { buildInterviewKit } from '../pipeline/orchestrator';

export const createKit = async (req: any, res: Response): Promise<void> => {
  try {
    const { jd, companyUrl, days } = req.body;
    
    // We create the kit initially in queued state
    const kit = new Kit({
      userId: req.userId,
      status: 'queued',
      generationState: 'queued',
      source: { jd_chars: jd?.length || 0, company_url: companyUrl }
    });
    
    await kit.save();
    
    res.status(202).json({ kitId: kit._id, status: 'queued' });
    
    // Asynchronously build the kit (background task)
    buildInterviewKit(jd, companyUrl, days).then(async (result) => {
      kit.status = 'completed';
      kit.generationState = 'completed';
      kit.companyBrief = result.company_brief;
      kit.role = result.role;
      kit.questions = result.questions;
      kit.flashcards = result.flashcards;
      kit.schedule = result.schedule;
      kit.coverage = result.coverage;
      kit.source = result.source;
      await kit.save();
    }).catch(async (e) => {
      kit.status = 'failed';
      kit.generationState = 'failed';
      await kit.save();
      console.error("Background kit generation failed:", e);
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getKits = async (req: any, res: Response): Promise<void> => {
  try {
    const kits = await Kit.find({ userId: req.userId }).select('_id source status generationState createdAt updatedAt role companyBrief questions flashcards');
    res.status(200).json(kits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getKitById = async (req: any, res: Response): Promise<void> => {
  try {
    const kit = await Kit.findOne({ _id: req.params.id, userId: req.userId });
    if (!kit) {
      res.status(404).json({ error: 'Kit not found' });
      return;
    }
    res.status(200).json(kit);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
