import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './note-form.html',
})
export class NoteFormComponent {
  @Input() isSaving = false;

  newNote = '';

  @Output() add = new EventEmitter<string>();

  addNote() {
    if (this.isSaving) return;

    const value = this.newNote.trim();
    if (!value) return;

    this.add.emit(value);
    this.newNote = '';
  }
}
