import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AddShoppingListDialogComponent } from './add-shopping-list-dialog.component';
import { ShoppingList } from '../../shared/models/shopping-list.model';

@Component({
  selector: 'app-add-shopping-list-dialog-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    AddShoppingListDialogComponent
  ],
  template: `<app-add-shopping-list-dialog [data]="data" (close)="onClose($event)"></app-add-shopping-list-dialog>`
})
export class AddShoppingListDialogWrapperComponent {
  constructor(
    public dialogRef: MatDialogRef<AddShoppingListDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingList | null
  ) {}

  onClose(result: any): void {
    this.dialogRef.close(result);
  }
}
