import express from 'express';
import { summarizeNote } from '../controllers/note.controller.js';
const router = express.Router();
router.post('/:id/summarize', summarizeNote);
export default router;
