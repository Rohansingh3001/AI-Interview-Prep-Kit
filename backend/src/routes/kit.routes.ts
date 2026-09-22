import { Router } from 'express';
import { createKit, getKits, getKitById } from '../controllers/kit.controller';
import { editQuestion, deleteQuestion } from '../controllers/kit-edit.controller';
import { savePractice, evaluateAnswer } from '../controllers/practice.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createKit);
router.get('/', getKits);
router.get('/:id', getKitById);

router.patch('/:id/questions/:questionId', editQuestion);
router.delete('/:id/questions/:questionId', deleteQuestion);
router.post('/:id/practice', savePractice);
router.post('/:id/evaluate', evaluateAnswer);

export default router;
