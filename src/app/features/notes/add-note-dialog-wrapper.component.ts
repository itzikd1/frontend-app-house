import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note } from '../../shared/models/note.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';

@Component({
  selector: 'app-add-note-dialog-wrapper',
  standalone: true,
  imports: [
    ModalDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <app-modal-dialog
      [title]="'Add Note'"
      [submitLabel]="'Add'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput type="text" [(ngModel)]="note.title" name="title" required />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Content</mat-label>
        <input matInput type="text" [(ngModel)]="note.content" name="content" />
      </mat-form-field>
    </app-modal-dialog>
  `,
  styleUrls: ['../../shared/components/modal-dialog.component.scss']
})
export class AddNoteDialogWrapperComponent {
  note: Partial<Note> = { title: '', content: '' };

  constructor(
    private dialogRef: MatDialogRef<AddNoteDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.note);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}

