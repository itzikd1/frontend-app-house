import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService, Note } from '../../core/services/note.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  notes = signal<Note[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteService.getAll().subscribe({
      next: notes => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Failed to load notes');
        this.loading.set(false);
      }
    });
  }
}

