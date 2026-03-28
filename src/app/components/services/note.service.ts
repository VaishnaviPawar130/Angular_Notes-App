import { Injectable } from '@angular/core';
import { Note } from '../../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly apiBaseUrl = 'http://localhost:3000/api/notes';

  async getNotes(): Promise<Note[]> {
    const response = await fetch(this.apiBaseUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch notes: ${response.status}`);
    }

    const notes = (await response.json()) as Note[];
    return [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }

  async addNote(text: string) {
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
  }

  async deleteNote(id: string) {
    const response = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete note: ${response.status}`);
    }
  }

  async updateNote(id: string, text: string) {
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
  }

  async togglePin(id: string, pinned: boolean) {
    const response = await fetch(`${this.apiBaseUrl}/${id}/pin`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle pin: ${response.status}`);
    }
  }

  async summarizeNote(id: string) {
    const response = await fetch(`${this.apiBaseUrl}/${id}/summarize`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to summarize note');
    }

    return response.json();
  }
}
