import { Router } from 'express';
import { summarizeNote } from '../controllers/note.controller.js';

const router = Router();

router.post('/:id/summarize', summarizeNote);

export default router;