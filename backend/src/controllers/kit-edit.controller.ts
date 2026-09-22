import Kit from '../models/Kit';

export const editQuestion = async (req: any, res: any) => {
  try {
    const { id, questionId } = req.params;
    const updateData = req.body;
    
    const kit = await Kit.findOne({ _id: id, userId: req.userId });
    if (!kit) return res.status(404).json({ error: 'Kit not found' });
    
    const questionIndex = kit.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return res.status(404).json({ error: 'Question not found' });
    
    kit.questions[questionIndex] = { 
      ...kit.questions[questionIndex], 
      ...updateData,
      edited: true 
    };
    
    kit.markModified('questions');
    await kit.save();
    
    res.json(kit.questions[questionIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteQuestion = async (req: any, res: any) => {
  try {
    const { id, questionId } = req.params;
    const kit = await Kit.findOne({ _id: id, userId: req.userId });
    if (!kit) return res.status(404).json({ error: 'Kit not found' });
    
    kit.questions = kit.questions.filter(q => q.id !== questionId);
    kit.markModified('questions');
    await kit.save();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
