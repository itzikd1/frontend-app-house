import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AddShoppingListDialogWrapperComponent } from './add-shopping-list-dialog-wrapper.component';
import { AddShoppingListDialogComponent } from './add-shopping-list-dialog.component';
import {ShoppingListComponent} from './shopping-list.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    ShoppingListComponent,
    AddShoppingListDialogWrapperComponent,
    AddShoppingListDialogComponent
  ],
  exports: [ShoppingListComponent]
})
export class ShoppingListModule {}

