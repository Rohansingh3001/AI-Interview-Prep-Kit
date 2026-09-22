import { Router } from 'express';
import multer from 'multer';
import { uploadAndExtract } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import * as fs from 'fs';
import * as path from 'path';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
const router = Router();

router.use(authenticate);
router.post('/', upload.single('file'), uploadAndExtract);

export default router;
