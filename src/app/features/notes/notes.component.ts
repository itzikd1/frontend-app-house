import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService, Note } from '../../core/services/note.service';
import { ItemListComponent } from '../../shared/components/item-list/item-list.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddNoteDialogWrapperComponent } from './add-note-dialog-wrapper.component';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemListComponent,
    FabButtonComponent,
    ItemCardComponent,
    MatButtonModule,
    MatIconModule,
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

  constructor(private noteService: NoteService, private dialog: MatDialog) {}

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
}
