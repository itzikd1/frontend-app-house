import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../shared/models/task.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">Add New Task</div>
      <form class="dialog-form" (ngSubmit)="onSubmit()" #form="ngForm">
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
        <div class="actions">
          <button type="submit" [disabled]="form.invalid">Add</button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./add-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskDialogComponent {
  task: Partial<Task> = { title: '', description: '', priority: 'Medium', dueDate: '' };

  private dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  public data: unknown = inject(MAT_DIALOG_DATA);

  onSubmit(): void {
    if (this.task.title) {
      this.dialogRef.close(this.task);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
