import { Note } from '../../../shared/models/note.model';

export class NoteUtils {
  // Constants for maintainability
  public static readonly TEMP_ID_PREFIX = 'temp_' as const;
  public static readonly DEFAULT_COLOR = '#ffffff' as const;
  public static readonly NOTE_COLORS = [
    '#ffffff', // White
    '#ffeb3b', // Yellow
    '#ff9800', // Orange
    '#f44336', // Red
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
  ] as const;

  /**
   * Generate a temporary ID for optimistic updates
   */
  public static generateTempId(): string {
    return `${this.TEMP_ID_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if a note ID is temporary
   */
  public static isTempId(id: string): boolean {
    return id.startsWith(this.TEMP_ID_PREFIX);
  }

  /**
   * Filter notes by pinned status
   */
  public static filterPinned(notes: readonly Note[]): Note[] {
    return notes.filter(note => note.isPinned === true);
  }

  /**
   * Filter notes by unpinned status
   */
  public static filterUnpinned(notes: readonly Note[]): Note[] {
    return notes.filter(note => !note.isPinned);
  }

  /**
   * Filter notes by search query
   */
  public static filterBySearch(notes: readonly Note[], query: string): Note[] {
    if (!query.trim()) {
      return [...notes];
    }

    const searchTerm = query.toLowerCase().trim();
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm) ||
      (note.content && note.content.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Filter notes by color
   */
  public static filterByColor(notes: readonly Note[], color: string): Note[] {
    return notes.filter(note => note.color === color);
  }

  /**
   * Sort notes with pinned notes first, then by updated date (newest first)
   */
  public static sortNotes(notes: readonly Note[]): Note[] {
    return [...notes].sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then by updated date (newest first)
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Get note preview text (first 100 characters of content)
   */
  public static getPreviewText(note: Note): string {
    if (!note.content) return '';
    return note.content.length > 100
      ? `${note.content.substring(0, 100)}...`
      : note.content;
  }

  /**
   * Check if a note is empty (no title and no content)
   */
  public static isEmpty(note: Partial<Note>): boolean {
    return !note.title?.trim() && !note.content?.trim();
  }

  /**
   * Validate note data
   */
  public static validateNote(note: Partial<Note>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!note.title?.trim()) {
      errors.push('Title is required');
    }

    if (note.title && note.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (note.content && note.content.length > 10000) {
      errors.push('Content must be less than 10,000 characters');
    }

    if (note.color && !this.NOTE_COLORS.includes(note.color as any)) {
      errors.push('Invalid color selected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get display color for a note (fallback to default if invalid)
   */
  public static getDisplayColor(note: Note): string {
    return note.color && this.NOTE_COLORS.includes(note.color as any)
      ? note.color
      : this.DEFAULT_COLOR;
  }

  /**
   * Format note date for display
   */
  public static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Create a note data object with defaults
   */
  public static createNoteData(partial: Partial<Note>): Partial<Note> {
    return {
      title: partial.title || '',
      content: partial.content || '',
      isPinned: partial.isPinned || false,
      color: partial.color || this.DEFAULT_COLOR,
      ...partial
    };
  }

  /**
   * Count notes by status
   */
  public static getNoteCounts(notes: readonly Note[]): {
    total: number;
    pinned: number;
    unpinned: number;
    byColor: Record<string, number>;
  } {
    const byColor: Record<string, number> = {};
    let pinned = 0;
    let unpinned = 0;

    notes.forEach(note => {
      // Count by pin status
      if (note.isPinned) {
        pinned++;
      } else {
        unpinned++;
      }

      // Count by color
      const color = note.color || this.DEFAULT_COLOR;
      byColor[color] = (byColor[color] || 0) + 1;
    });

    return {
      total: notes.length,
      pinned,
      unpinned,
      byColor
    };
  }
}
