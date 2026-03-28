import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-item',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './note-item.html',
})
export class NoteItemComponent {
  @Input() note!: Note;

  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; text: string }>();
  @Output() pinToggle = new EventEmitter<string>();
  @Output() summarize = new EventEmitter<string>();

  isEditing = false;
  editedText = '';

  togglePin() {
    this.pinToggle.emit(this.note.id);
  }

  startEdit() {
    this.isEditing = true;
    this.editedText = this.note.text;
  }

  saveEdit() {
    const value = this.editedText.trim();
    if (!value) return;

    this.update.emit({
      id: this.note.id,
      text: value,
    });

    this.isEditing = false;
  }

  deleteNote() {
    this.delete.emit(this.note.id);
  }

  onSummarize() {
    console.log('note-item summarize clicked:', this.note.id);
    this.summarize.emit(this.note.id);
  }
}