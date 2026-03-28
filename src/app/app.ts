import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Note } from './models/note.model';
import { NoteFormComponent } from './components/note-form/note-form';
import { NoteListComponent } from './components/note-list/note-list';
import { NoteService } from './components/services/note.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NoteFormComponent, NoteListComponent, FormsModule,],
  templateUrl: './app.html',
})
export class App implements OnInit {
  notes: Note[] = [];
  searchTerm = '';
  isDarkMode = false;
  isSaving = false;

  constructor(
    private noteService: NoteService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadNotes();

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    this.changeDetectorRef.markForCheck();
  }

  async loadNotes() {
    this.notes = await this.noteService.getNotes();
    this.sortNotes();
    this.changeDetectorRef.markForCheck();
  }

  get filteredNotes() {
    if (!this.searchTerm.trim()) return this.notes;

    return this.notes.filter((n) =>
      n.text.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
    this.changeDetectorRef.markForCheck();
  }

  applyTheme() {
    const root = document.documentElement;

    if (this.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  async addNote(text: string) {
     console.log('app.ts addNote called:', text);
    if (!text.trim() || this.isSaving) return;

    this.isSaving = true;
    try {
      await this.noteService.addNote(text);
      await this.loadNotes();
    } finally {
      this.isSaving = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  async deleteNote(id: string) {
    await this.noteService.deleteNote(id);
    await this.loadNotes();
    this.changeDetectorRef.markForCheck();
  }

  async updateNote(data: { id: string; text: string }) {
    await this.noteService.updateNote(data.id, data.text);
    await this.loadNotes();
    this.changeDetectorRef.markForCheck();
  }
  async summarizeNote(id: string) {
    try {
      await this.noteService.summarizeNote(id);
      await this.loadNotes();
    } catch (error) {
      console.error('summarizeNote error:', error);
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  sortNotes() {
    this.notes.sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }

  async togglePin(id: string) {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return;

    await this.noteService.togglePin(id, note.pinned);
    await this.loadNotes();
    this.changeDetectorRef.markForCheck();
  }
  
}
