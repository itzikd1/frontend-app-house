import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Car } from '../../shared/models/car.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';

@Component({
  selector: 'app-add-car-dialog-wrapper',
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
      [title]="'Add Car'"
      [submitLabel]="'Add'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Make</mat-label>
        <input matInput type="text" [(ngModel)]="car.make" name="make" required />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Model</mat-label>
        <input matInput type="text" [(ngModel)]="car.model" name="model" required />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Year</mat-label>
        <input matInput type="number" [(ngModel)]="car.year" name="year" min="1900" max="2100" />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>License Plate</mat-label>
        <input matInput type="text" [(ngModel)]="car.licensePlate" name="licensePlate" />
      </mat-form-field>
    </app-modal-dialog>
  `,
  styleUrls: ['../../shared/components/modal-dialog.component.scss']
})
export class AddCarDialogWrapperComponent {
  car: Partial<Car> = { make: '', model: '', year: new Date().getFullYear(), licensePlate: '' };

  constructor(
    private dialogRef: MatDialogRef<AddCarDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.car);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}

