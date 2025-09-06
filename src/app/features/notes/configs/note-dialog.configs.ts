import { Validators } from '@angular/forms';
import { FormDialogConfig } from '../../../shared/components/form-dialog.component';
import { Note } from '../../../shared/models/note.model';

export class NoteDialogConfigs {
  static NOTE_COLORS = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
  ];

  /**
   * Create configuration for adding a new note
   */
  static createAddNoteConfig(): FormDialogConfig {
    return {
      title: 'Add New Note',
      submitLabel: 'Add Note',
      cancelLabel: 'Cancel',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          validators: [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(200)
          ],
          placeholder: 'Enter note title'
        },
        {
          key: 'content',
          label: 'Content',
          type: 'textarea',
          required: false,
          validators: [Validators.maxLength(10000)],
          placeholder: 'Enter note content (optional)',
          rows: 4
        },
        {
          key: 'color',
          label: 'Color',
          type: 'select',
          required: false,
          options: this.NOTE_COLORS.map(color => ({ label: color, value: color })),
        },
        {
          key: 'isPinned',
          label: 'Pin this note',
          type: 'select',
          required: false,
          options: [
            { label: 'Not pinned', value: 'false' },
            { label: 'Pinned', value: 'true' },
          ],
        }
      ]
    };
  }

  /**
   * Create configuration for editing an existing note
   */
  static createEditNoteConfig(note: Note): FormDialogConfig {
    const config = this.createAddNoteConfig();
    return {
      ...config,
      title: 'Edit Note',
      submitLabel: 'Update Note',
      initialData: {
        title: note.title,
        content: note.content || '',
        color: note.color || '#ffffff',
        isPinned: note.isPinned ? 'true' : 'false',
      }
    };
  }

  /**
   * Create configuration for quick add note (minimal fields)
   */
  static createQuickAddNoteConfig(): FormDialogConfig {
    return {
      title: 'Quick Add Note',
      submitLabel: 'Add Note',
      cancelLabel: 'Cancel',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          validators: [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(200)
          ],
          placeholder: 'Enter note title'
        },
        {
          key: 'content',
          label: 'Content',
          type: 'textarea',
          required: false,
          validators: [Validators.maxLength(10000)],
          placeholder: 'Enter note content (optional)',
          rows: 3
        }
      ]
    };
  }
}
