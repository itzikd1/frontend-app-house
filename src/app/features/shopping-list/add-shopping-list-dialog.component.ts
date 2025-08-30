import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListService } from '../../core/services/shopping-list.service';
import { ShoppingList, ShoppingListItem } from '../../shared/models/shopping-list.model';

@Component({
  selector: 'app-add-shopping-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">{{ data ? 'Edit Shopping List' : 'Add Shopping List' }}</div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
        <mat-form-field>
          <input matInput placeholder="List Name" formControlName="name" required />
        </mat-form-field>
        <div formArrayName="items">
          <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i">
            <mat-form-field>
              <input matInput placeholder="Item Name" formControlName="name" required />
            </mat-form-field>
            <mat-form-field>
              <input matInput type="number" placeholder="Quantity" formControlName="quantity" required />
            </mat-form-field>
            <mat-checkbox formControlName="checked">Checked</mat-checkbox>
            <button mat-icon-button color="warn" type="button" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
          </div>
        </div>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit">{{ data ? 'Update' : 'Add' }} List</button>
          <button mat-button type="button" (click)="onClose()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class AddShoppingListDialogComponent {
  @Input() data: ShoppingList | null = null;
  @Output() close = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shoppingListService: ShoppingListService,
    @Inject(MAT_DIALOG_DATA) public dialogData: ShoppingList | null
  ) {
    this.form = this.fb.group({
      name: [dialogData?.name || '', Validators.required],
      items: this.fb.array([])
    });
    if (dialogData?.items) {
      dialogData.items.forEach(item => this.addItem(item));
    } else {
      this.addItem();
    }
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(item?: Partial<ShoppingListItem>): void {
    this.items.push(this.fb.group({
      name: [item?.name || '', Validators.required],
      quantity: [item?.quantity || 1, Validators.required],
      checked: [item?.purchased || false]
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    if (this.dialogData) {
      this.shoppingListService.update(this.dialogData.id, value).subscribe(result => {
        this.close.emit(result);
      });
    } else {
      this.shoppingListService.create(value).subscribe(result => {
        this.close.emit(result);
      });
    }
  }

  onClose(): void {
    this.close.emit(null);
  }
}
