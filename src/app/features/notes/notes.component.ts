import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService, Note } from '../../core/services/note.service';
import { ItemListComponent } from '../../shared/components/item-list/item-list.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { ItemDialogComponent } from '../../shared/components/item-dialog/item-dialog.component';
import { ItemFormComponent } from '../../shared/components/item-form/item-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemListComponent,
    FabButtonComponent,
    ItemCardComponent,
    ItemDialogComponent,
    ItemFormComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  notes = signal<Note[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  showDialog = signal<boolean>(false);
  adding = signal<boolean>(false);
  newNote = signal<Partial<Note>>({ title: '', content: '' });

  constructor(private noteService: NoteService) {}

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
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.newNote.set({ title: '', content: '' });
  }

  addNote(): void {
    if (this.adding()) return;
    if (!this.newNote().title) return;
    this.adding.set(true);
    this.noteService.create(this.newNote()).subscribe({
      next: (note: Note) => {
        this.notes.set([note, ...this.notes()]);
        this.closeDialog();
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
