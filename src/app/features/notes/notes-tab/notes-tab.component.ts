import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteFacadeService } from '../services/note-facade.service';
import { NoteDialogConfigs } from '../configs/note-dialog.configs';
import { FormDialogService } from '../../../shared/services/form-dialog.service';
import { FabButtonComponent } from '../../../shared/components/fab-button/fab-button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Note } from '../../../shared/models/note.model';
import { NoteUtils } from '../utils/note.utils';

@Component({
  selector: 'app-notes-tab',
  standalone: true,
  imports: [
    CommonModule,
    FabButtonComponent,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './notes-tab.component.html',
  styleUrl: './notes-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesTabComponent {
  private readonly noteFacade = inject(NoteFacadeService);
  private readonly formDialogService = inject(FormDialogService);

  // Expose facade signals directly
  public readonly filteredNotes = this.noteFacade.filteredUnpinnedNotes;
  public readonly noteLoading = this.noteFacade.noteLoading;
  public readonly noteError = this.noteFacade.noteError;
  public readonly searchQuery = this.noteFacade.searchQuery;
  public readonly selectedColor = this.noteFacade.selectedColor;

  // Color options for filtering
  public readonly colorOptions = NoteUtils.NOTE_COLORS;

  /**
   * Open dialog to add a new note
   */
  public openAddNoteDialog(): void {
    const config = NoteDialogConfigs.createAddNoteConfig();

    this.formDialogService.openFormDialog(config).subscribe(result => {
      if (result) {
        if ('isPinned' in result) {
          result['isPinned'] = result['isPinned'] === true;
        }

        this.noteFacade.addNote(result);
      }
    });
  }

  /**
   * Open dialog to edit an existing note
   */
  public openEditNoteDialog(note: Note): void {
    const config = NoteDialogConfigs.createEditNoteConfig(note);

    this.formDialogService.openFormDialog(config).subscribe(result => {
      if (result) {
        if ('isPinned' in result) {
          result['isPinned'] = result['isPinned'] === 'true';
        }

        this.noteFacade.updateNote(note.id, result);
      }
    });
  }

  /**
   * Delete a note with confirmation
   */
  public deleteNote(note: Note): void {
    // TODO: Add confirmation dialog
    this.noteFacade.deleteNote(note.id);
  }

  /**
   * Toggle pin status of a note
   */
  public togglePin(note: Note): void {
    this.noteFacade.togglePin(note.id);
  }

  /**
   * Update note color
   */
  public updateNoteColor(note: Note, color: string): void {
    this.noteFacade.updateNoteColor(note.id, color);
  }

  /**
   * Handle search query changes
   */
  public onSearchQueryChange(query: string): void {
    this.noteFacade.setSearchQuery(query);
  }

  /**
   * Handle color filter changes
   */
  public onColorFilterChange(color: string | null): void {
    this.noteFacade.setColorFilter(color);
  }

  /**
   * Clear all filters
   */
  public clearFilters(): void {
    this.noteFacade.clearFilters();
  }

  /**
   * Get note preview text
   */
  public getPreviewText(note: Note): string {
    return NoteUtils.getPreviewText(note);
  }

  /**
   * Get display color for note
   */
  public getDisplayColor(note: Note): string {
    return NoteUtils.getDisplayColor(note);
  }

  /**
   * Format note date for display
   */
  public formatDate(dateString: string): string {
    return NoteUtils.formatDate(dateString);
  }

  /**
   * Track function for notes list
   */
  public trackByNoteId(index: number, note: Note): string {
    return note.id;
  }
}
