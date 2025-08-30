import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Goal } from '../../core/interfaces/goal.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';

@Component({
  selector: 'app-add-goal-dialog-wrapper',
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
      [title]="'Add Goal'"
      [submitLabel]="'Add'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput type="text" [(ngModel)]="goal.title" name="title" required />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Description</mat-label>
        <input matInput type="text" [(ngModel)]="goal.description" name="description" />
      </mat-form-field>
    </app-modal-dialog>
  `,
  styleUrls: ['../../shared/components/modal-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGoalDialogWrapperComponent {
  goal: Partial<Goal> = { title: '', description: '' };
  private dialogRef = inject(MatDialogRef<AddGoalDialogWrapperComponent>);
  public data: unknown = inject(MAT_DIALOG_DATA);

  onSubmit(): void {
    this.dialogRef.close(this.goal);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
