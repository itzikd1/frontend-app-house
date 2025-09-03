import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AddShoppingListDialogComponent } from './add-shopping-list-dialog.component';
import { ShoppingList } from '../../core/interfaces/shopping-list.model';

@Component({
  selector: 'app-add-shopping-list-dialog-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    AddShoppingListDialogComponent
  ],
  template: `<app-add-shopping-list-dialog [data]="data" (close)="onClose($event)"></app-add-shopping-list-dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddShoppingListDialogWrapperComponent {
  public dialogRef = inject(MatDialogRef<AddShoppingListDialogWrapperComponent>);
  public data: ShoppingList | null = inject(MAT_DIALOG_DATA);

  onClose(result: unknown): void {
    this.dialogRef.close(result);
  }
}
