import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../core/services/note.service';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddNoteDialogWrapperComponent } from './add-note-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import {Note} from '../../shared/models/note.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FabButtonComponent,
    ItemCardComponent,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  notes = signal<Note[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  adding = signal<boolean>(false);
  newNote = signal<Partial<Note>>({ title: '', content: '' });

  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchNotes();
  }

  fetchNotes(): void {
    this.loading.set(true);
    this.noteService.getAll().subscribe({
      next: notes => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load notes');
        this.loading.set(false);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddNoteDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: Partial<Note> | null) => {
      if (result && result.title) {
        this.addNote(result);
      }
    });
  }

  addNote(note?: Partial<Note>): void {
    if (this.adding()) return;
    const noteToAdd = note ?? this.newNote();
    if (!noteToAdd.title) return;
    this.adding.set(true);
    this.noteService.create(noteToAdd).subscribe({
      next: (createdNote: Note) => {
        this.notes.set([createdNote, ...this.notes()]);
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add note');
        this.adding.set(false);
      }
    });
  }

  deleteNote(note: Note): void {
    this.loading.set(true);
    this.noteService.delete(note.id).subscribe({
      next: () => {
        this.notes.set(this.notes().filter((n: Note) => n.id !== note.id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete note');
        this.loading.set(false);
      }
    });
  }

  openEditDialog(note: Note): void {
    const dialogRef = this.dialog.open(AddNoteDialogWrapperComponent, {
      width: '400px',
      data: {
        note: note,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe((result: Partial<Note> | null) => {
      if (result && result.title) {
        this.updateNote(note.id, result);
      }
    });
  }

  updateNote(id: string, updatedNote: Partial<Note>): void {
    this.loading.set(true);
    this.noteService.update(id, updatedNote).subscribe({
      next: (updated: Note) => {
        const currentNotes = this.notes();
        const index = currentNotes.findIndex((n: Note) => n.id === id);

        if (index !== -1) {
          const updatedNotes = [...currentNotes];
          updatedNotes[index] = updated;
          this.notes.set(updatedNotes);
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to update note');
        this.loading.set(false);
      }
    });
  }
}
