import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteFacadeService } from './services/note-facade.service';
import { TabSwitcherComponent, TabOption } from '../../shared/components/tab-switcher/tab-switcher.component';
import { NotesTabComponent } from './notes-tab/notes-tab.component';
import { PinnedNotesTabComponent } from './pinned-notes-tab/pinned-notes-tab.component';
import {FabButtonComponent} from '../../shared/components/fab-button/fab-button.component';
import {ItemCardComponent} from '../../shared/components/item-card/item-card.component';
import {LoadingSpinnerComponent} from '../../shared/components/loading-spinner/loading-spinner.component';
import {MatIcon} from '@angular/material/icon';

// Constants for type safety
const NOTES_TAB_ID = 'notes' as const;
const PINNED_NOTES_TAB_ID = 'pinned-notes' as const;
type NotesTabId = typeof NOTES_TAB_ID | typeof PINNED_NOTES_TAB_ID;

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    TabSwitcherComponent,
    NotesTabComponent,
    PinnedNotesTabComponent,
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  private readonly noteFacade = inject(NoteFacadeService);

  // Tab management
  public readonly selectedTab = signal<NotesTabId>(NOTES_TAB_ID);
  public readonly tabOptions: TabOption[] = [
    { id: NOTES_TAB_ID, label: 'All Notes' },
    { id: PINNED_NOTES_TAB_ID, label: 'Pinned' },
  ] as const;

  // Tab constants for template
  public readonly NOTES_TAB_ID = NOTES_TAB_ID;
  public readonly PINNED_NOTES_TAB_ID = PINNED_NOTES_TAB_ID;

  // Expose facade signals for summary/counts
  public readonly noteLoading = this.noteFacade.noteLoading;
  public readonly noteError = this.noteFacade.noteError;

  ngOnInit(): void {
    // Load notes when component initializes
    this.noteFacade.loadNotes();
  }

  /**
   * Handle tab selection with type safety
   */
  public onTabChange(tabId: string): void {
    if (this.isValidTab(tabId)) {
      this.selectedTab.set(tabId);
      // Clear filters when switching tabs
      this.noteFacade.clearFilters();
    }
  }

  /**
   * Type guard for tab validation
   */
  private isValidTab(tab: string): tab is NotesTabId {
    return tab === NOTES_TAB_ID || tab === PINNED_NOTES_TAB_ID;
  }
}
