import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { sequelize } from './db.js';
import { Note } from './models/note.model.js';
import noteRoutes from './routes/note.routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use('/api/notes', noteRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/notes', async (_req, res) => {
  const notes = await Note.findAll({
    order: [
      ['pinned', 'DESC'],
      ['createdAtMs', 'DESC'],
    ],
  });

  res.json(
    notes.map((note) => ({
      id: note.id,
      text: note.text,
      createdAt: Number(note.createdAtMs),
      pinned: Boolean(note.pinned),
      aiSummary: note.aiSummary,
    }))
  );
});

app.post('/api/notes', async (req, res) => {
  const text = String(req.body?.text || '').trim();
  if (!text) {
    res.status(400).json({ message: 'text is required' });
    return;
  }

  const note = await Note.create({
    id: randomUUID(),
    text,
    createdAtMs: Date.now(),
    pinned: false,
  });

  res.status(201).json({
    id: note.id,
    text: note.text,
    createdAt: Number(note.createdAtMs),
    pinned: Boolean(note.pinned),
    aiSummary: note.aiSummary,
  });
});

app.put('/api/notes/:id', async (req, res) => {
  const text = String(req.body?.text || '').trim();
  if (!text) {
    res.status(400).json({ message: 'text is required' });
    return;
  }

  const note = await Note.findByPk(req.params.id);
  if (!note) {
    res.status(404).json({ message: 'note not found' });
    return;
  }

  note.text = text;
  await note.save();

  res.json({
    id: note.id,
    text: note.text,
    createdAt: Number(note.createdAtMs),
    pinned: Boolean(note.pinned),
    aiSummary: note.aiSummary,
  });
});

app.patch('/api/notes/:id/pin', async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note) {
    res.status(404).json({ message: 'note not found' });
    return;
  }

  note.pinned = !note.pinned;
  await note.save();

  res.json({
    id: note.id,
    text: note.text,
    createdAt: Number(note.createdAtMs),
    pinned: Boolean(note.pinned),
    aiSummary: note.aiSummary,
  });
});

app.delete('/api/notes/:id', async (req, res) => {
  const deleted = await Note.destroy({
    where: { id: req.params.id },
  });

  if (!deleted) {
    res.status(404).json({ message: 'note not found' });
    return;
  }

  res.status(204).send();
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Notes API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
