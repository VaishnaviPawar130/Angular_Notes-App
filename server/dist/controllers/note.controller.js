import { GoogleGenAI } from '@google/genai';
import { Note } from '../models/note.model.js';
const geminiClient = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;
function buildSummary(text) {
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
async function generateSummary(text) {
    if (!geminiClient) {
        return buildSummary(text);
    }
    try {
        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Summarize the following note in 2 to 3 concise bullet points. Avoid repeating the original wording when possible.\n\nNote:\n${text}`,
        });
        const summary = response.text?.trim();
        return summary || buildSummary(text);
    }
    catch (error) {
        console.error('Gemini summarize fallback:', error);
        return buildSummary(text);
    }
}
export async function summarizeNote(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const note = await Note.findByPk(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        const summary = await generateSummary(note.text);
        note.aiSummary = summary;
        await note.save();
        res.json({
            message: 'Summary generated successfully',
            note,
        });
    }
    catch (error) {
        console.error('summarizeNote error:', error);
        res.status(500).json({ message: 'Error generating summary' });
    }
}
