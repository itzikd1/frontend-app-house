import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListService } from '../../core/services/shopping-list.service';
import { ShoppingList, ShoppingListItem } from '../../core/interfaces/shopping-list.model';

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
            <mat-checkbox formControlName="purchased">Purchased</mat-checkbox>
            <button mat-icon-button color="warn" type="button" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
          </div>
        </div>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit">{{ data ? 'Update' : 'Add' }} List</button>
          <button mat-button type="button" (click)="onClose()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddShoppingListDialogComponent {
  @Input() data: ShoppingList | null = null;
  @Output() dialogClose = new EventEmitter<ShoppingList | ShoppingListItem | null>();

  form: FormGroup;

  private fb = inject(FormBuilder);
  private shoppingListService = inject(ShoppingListService);
  public dialogData: ShoppingList | null = inject(MAT_DIALOG_DATA);

  constructor() {
    this.form = this.fb.group({
      name: [this.dialogData?.name || '', Validators.required],
      items: this.fb.array([])
    });
    if (this.dialogData?.items) {
      this.dialogData.items.forEach(item => this.addItem(item));
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
      purchased: [item?.purchased || false]
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    if (this.dialogData && this.dialogData.id && !Array.isArray(this.dialogData.items)) {
      // Editing a single shopping item
      const item = this.items.at(0)?.value;
      if (item) {
        this.shoppingListService.updateItem(this.dialogData.id, item).subscribe(result => {
          this.dialogClose.emit(result);
        });
      }
    } else if (this.dialogData) {
      // Editing a shopping list
      this.shoppingListService.update(this.dialogData.id, value).subscribe(result => {
        this.dialogClose.emit(result);
      });
    } else {
      // Creating a new shopping list
      this.shoppingListService.create(value).subscribe(result => {
        this.dialogClose.emit(result);
      });
    }
  }

  onClose(): void {
    this.dialogClose.emit(null);
  }
}
