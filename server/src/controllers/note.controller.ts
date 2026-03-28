import type { Request, Response } from 'express';
import { Note } from '../models/note.model.js';

function buildSummary(text: string) {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (!cleanText) {
    return '';
  }

  const sentences = cleanText
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (sentences.length > 0) {
    return sentences.map((sentence) => `- ${sentence}`).join('\n');
  }

  return `- ${cleanText.slice(0, 120)}`;
}

export async function summarizeNote(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const note = await Note.findByPk(id);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    const summary = buildSummary(note.text);
    note.aiSummary = summary;
    await note.save();

    res.json({
      message: 'Summary generated successfully',
      note,
    });
  } catch (error) {
    console.error('summarizeNote error:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
}
