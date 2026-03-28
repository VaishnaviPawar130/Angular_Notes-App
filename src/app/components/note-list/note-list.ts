import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteItemComponent } from '../note-item/note-item';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, NoteItemComponent],
  templateUrl: './note-list.html',
})
export class NoteListComponent {
  @Input() notes: Note[] = [];

  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; text: string }>();
  @Output() pinToggle = new EventEmitter<string>();
  @Output() summarize = new EventEmitter<string>();

  onDelete(id: string) {
    this.delete.emit(id);
  }

  onUpdate(data: { id: string; text: string }) {
    this.update.emit(data);
  }

  onPinToggle(id: string) {
    this.pinToggle.emit(id);
  }

  onSummarize(id: string) {
    this.summarize.emit(id);
  }
}
