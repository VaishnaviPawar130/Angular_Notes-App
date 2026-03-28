import { Injectable } from '@angular/core';
import { Note } from '../../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly apiBaseUrl = 'http://localhost:3000/api/notes';
  private readonly storageKey = 'notes-app.notes';

  async getNotes(): Promise<Note[]> {
    try {
      const response = await fetch(this.apiBaseUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      const notes = (await response.json()) as Note[];
      return [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    } catch {
      return this.getLocalNotes();
    }
  }

  async addNote(text: string) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.status}`);
      }
    } catch {
      this.addLocalNote(text);
    }
  }

  async deleteNote(id: string) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to delete note: ${response.status}`);
      }
    } catch {
      this.deleteLocalNote(id);
    }
  }

  async updateNote(id: string, text: string) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`);
      }
    } catch {
      this.updateLocalNote(id, text);
    }
  }

  async togglePin(id: string, pinned: boolean) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}/pin`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle pin: ${response.status}`);
      }
    } catch {
      this.toggleLocalPin(id, pinned);
    }
  }

  async summarizeNote(id: string) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}/summarize`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to summarize note');
      }

      return response.json();
    } catch {
      this.summarizeLocalNote(id);
      return { ok: true };
    }
  }

  private getLocalNotes(): Note[] {
    const rawNotes = localStorage.getItem(this.storageKey);
    if (!rawNotes) {
      return [];
    }

    try {
      const notes = JSON.parse(rawNotes) as Note[];
      return [...notes].sort((a, b) => b.createdAt - a.createdAt);
    } catch {
      return [];
    }
  }

  private saveLocalNotes(notes: Note[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(notes));
  }

  private addLocalNote(text: string) {
    const notes = this.getLocalNotes();
    notes.unshift({
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      pinned: false,
      aiSummary: null,
    });
    this.saveLocalNotes(notes);
  }

  private deleteLocalNote(id: string) {
    const notes = this.getLocalNotes().filter((note) => note.id !== id);
    this.saveLocalNotes(notes);
  }

  private updateLocalNote(id: string, text: string) {
    const notes = this.getLocalNotes().map((note) =>
      note.id === id ? { ...note, text } : note
    );
    this.saveLocalNotes(notes);
  }

  private toggleLocalPin(id: string, pinned: boolean) {
    const notes = this.getLocalNotes().map((note) =>
      note.id === id ? { ...note, pinned: !pinned } : note
    );
    this.saveLocalNotes(notes);
  }

  private summarizeLocalNote(id: string) {
    const notes = this.getLocalNotes().map((note) => {
      if (note.id !== id) {
        return note;
      }

      const cleaned = note.text.replace(/\s+/g, ' ').trim();
      const sentences = cleaned
        .split(/[.!?]+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean)
        .slice(0, 3);

      const aiSummary =
        sentences.length > 0
          ? sentences.map((sentence) => `- ${sentence}`).join('\n')
          : `- ${cleaned.slice(0, 120)}`;

      return { ...note, aiSummary };
    });

    this.saveLocalNotes(notes);
  }
}
