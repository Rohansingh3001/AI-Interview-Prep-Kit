import { Request, Response } from 'express';
import { convert } from 'officeparser';
import * as fs from 'fs';
import * as path from 'path';

export const uploadAndExtract = async (req: Request, res: Response): Promise<void> => {
  let finalPath = '';
  try {
    console.log('Upload request received', req.file);
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    
    // officeparser needs the correct extension to work
    const ext = path.extname(req.file.originalname);
    finalPath = req.file.path + ext;
    fs.renameSync(req.file.path, finalPath);
    
    let text = '';
    
    if (ext.toLowerCase() === '.txt') {
      // Fallback for TXT files which officeparser doesn't support directly
      text = fs.readFileSync(finalPath, 'utf8');
    } else {
      // Convert to markdown text using officeparser
      const result = await convert(finalPath, 'markdown');
      text = result.value || '';
    }
    
    console.log('Extraction successful, text length:', text?.length);
    
    // Clean up uploaded file
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    
    res.json({ text });
  } catch (err: any) {
    console.error('Extraction error:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (finalPath && fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    res.status(500).json({ error: 'Failed to parse document: ' + err.message });
  }
};
