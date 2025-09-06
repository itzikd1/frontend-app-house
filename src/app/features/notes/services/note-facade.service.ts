import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NoteService } from '../../../core/services/note.service';
import { Note } from '../../../shared/models/note.model';
import { NoteUtils } from '../utils/note.utils';

@Injectable({
  providedIn: 'root'
})
export class NoteFacadeService {
  private readonly noteService = inject(NoteService);

  // Private writable signals
  private readonly _notes = signal<Note[]>([]);
  private readonly _noteLoading = signal<boolean>(false);
  private readonly _noteError = signal<string | null>(null);
  private readonly _searchQuery = signal<string>('');
  private readonly _selectedColor = signal<string | null>(null);

  // Public readonly signals
  public readonly notes = this._notes.asReadonly();
  public readonly noteLoading = this._noteLoading.asReadonly();
  public readonly noteError = this._noteError.asReadonly();
  public readonly searchQuery = this._searchQuery.asReadonly();
  public readonly selectedColor = this._selectedColor.asReadonly();

  // Computed signals for derived state
  public readonly pinnedNotes = computed(() => {
    const allNotes = this._notes();
    return NoteUtils.filterPinned(allNotes);
  });

  public readonly unpinnedNotes = computed(() => {
    const allNotes = this._notes();
    return NoteUtils.filterUnpinned(allNotes);
  });

  public readonly filteredNotes = computed(() => {
    const allNotes = this._notes();
    const search = this._searchQuery();
    const color = this._selectedColor();

    let filtered = NoteUtils.filterBySearch(allNotes, search);
    if (color) {
      filtered = NoteUtils.filterByColor(filtered, color);
    }

    return NoteUtils.sortNotes(filtered);
  });

  public readonly filteredPinnedNotes = computed(() => {
    const pinnedNotes = this.pinnedNotes();
    const search = this._searchQuery();
    const color = this._selectedColor();

    let filtered = NoteUtils.filterBySearch(pinnedNotes, search);
    if (color) {
      filtered = NoteUtils.filterByColor(filtered, color);
    }

    return NoteUtils.sortNotes(filtered);
  });

  public readonly filteredUnpinnedNotes = computed(() => {
    const unpinnedNotes = this.unpinnedNotes();
    const search = this._searchQuery();
    const color = this._selectedColor();

    let filtered = NoteUtils.filterBySearch(unpinnedNotes, search);
    if (color) {
      filtered = NoteUtils.filterByColor(filtered, color);
    }

    return NoteUtils.sortNotes(filtered);
  });

  /**
   * Load all notes
   */
  public loadNotes(): void {
    this._noteLoading.set(true);
    this._noteError.set(null);

    this.noteService.getAll().subscribe({
      next: (notes) => {
        this._notes.set(NoteUtils.sortNotes(notes));
        this._noteLoading.set(false);
      },
      error: () => {
        this._noteError.set('Failed to load notes.');
        this._noteLoading.set(false);
      }
    });
  }

  /**
   * Add a new note with optimistic updates
   */
  public async addNote(noteData: Partial<Note>): Promise<void> {
    const tempId = NoteUtils.generateTempId();
    const optimisticNote: Note = {
      id: tempId,
      title: noteData.title || '',
      content: noteData.content || '',
      isPinned: noteData.isPinned || false,
      color: noteData.color || '#ffffff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: noteData.userId,
      familyId: noteData.familyId || null,
    };

    // Add optimistically
    this._notes.update(notes => [optimisticNote, ...notes]);

    try {
      const savedNote = await firstValueFrom(this.noteService.create(noteData));
      // Replace temp with real note
      this._notes.update(notes =>
        notes.map(n => n.id === tempId ? savedNote : n)
      );
    } catch (error) {
      // Remove optimistic note on error
      this._notes.update(notes => notes.filter(n => n.id !== tempId));
      this._noteError.set('Failed to add note.');
    }
  }

  /**
   * Update an existing note with optimistic updates
   */
  public async updateNote(id: string, noteData: Partial<Note>): Promise<void> {
    // Store original note for rollback
    const originalNotes = this._notes();
    const originalNote = originalNotes.find(n => n.id === id);

    if (!originalNote) {
      this._noteError.set('Note not found.');
      return;
    }

    // Update optimistically
    const updatedNote = { ...originalNote, ...noteData, updatedAt: new Date().toISOString() };
    this._notes.update(notes =>
      notes.map(n => n.id === id ? updatedNote : n)
    );

    try {
      const savedNote = await firstValueFrom(this.noteService.update(id, noteData));
      // Update with server response
      this._notes.update(notes =>
        notes.map(n => n.id === id ? savedNote : n)
      );
    } catch (error) {
      // Rollback on error
      this._notes.set(originalNotes);
      this._noteError.set('Failed to update note.');
    }
  }

  /**
   * Delete a note with optimistic updates
   */
  public async deleteNote(id: string): Promise<void> {
    // Store original notes for rollback
    const originalNotes = this._notes();

    // Remove optimistically
    this._notes.update(notes => notes.filter(n => n.id !== id));

    try {
      await firstValueFrom(this.noteService.delete(id));
    } catch (error) {
      // Rollback on error
      this._notes.set(originalNotes);
      this._noteError.set('Failed to delete note.');
    }
  }

  /**
   * Toggle pin status of a note
   */
  public async togglePin(id: string): Promise<void> {
    const note = this._notes().find(n => n.id === id);
    if (!note) {
      this._noteError.set('Note not found.');
      return;
    }

    await this.updateNote(id, { isPinned: !note.isPinned });
  }

  /**
   * Update note color
   */
  public async updateNoteColor(id: string, color: string): Promise<void> {
    await this.updateNote(id, { color });
  }

  /**
   * Set search query for filtering
   */
  public setSearchQuery(query: string): void {
    this._searchQuery.set(query.trim());
  }

  /**
   * Set color filter
   */
  public setColorFilter(color: string | null): void {
    this._selectedColor.set(color);
  }

  /**
   * Clear all filters
   */
  public clearFilters(): void {
    this._searchQuery.set('');
    this._selectedColor.set(null);
  }

  /**
   * Clear error state
   */
  public clearError(): void {
    this._noteError.set(null);
  }
}
