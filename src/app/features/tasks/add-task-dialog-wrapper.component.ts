import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../shared/models/task.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';

@Component({
  selector: 'app-add-task-dialog-wrapper',
  standalone: true,
  imports: [
    ModalDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  template: `
    <app-modal-dialog
      [title]="'Add New Task'"
      [submitLabel]="'Add'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <input type="text" placeholder="Title" [(ngModel)]="task.title" name="title" required />
      <input type="text" placeholder="Description" [(ngModel)]="task.description" name="description" />
      <mat-form-field appearance="fill">
        <mat-label>Priority</mat-label>
        <mat-select [(ngModel)]="task.priority" name="priority">
          <mat-option value="Low">Low</mat-option>
          <mat-option value="Medium">Medium</mat-option>
          <mat-option value="High">High</mat-option>
        </mat-select>
      </mat-form-field>
      <input type="date" [(ngModel)]="task.dueDate" name="dueDate" />
    </app-modal-dialog>
  `,
  styleUrls: ['./add-task-dialog.component.scss']
})
export class AddTaskDialogWrapperComponent {
  task: Partial<Task> = { title: '', description: '', priority: 'Medium', dueDate: '' };

  constructor(
    private dialogRef: MatDialogRef<AddTaskDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.task);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
