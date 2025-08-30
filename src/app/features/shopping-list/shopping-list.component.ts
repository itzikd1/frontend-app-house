import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../core/services/shopping-list.service';
import { AddShoppingListDialogWrapperComponent } from './add-shopping-list-dialog-wrapper.component';
import { ShoppingListItem } from '../../shared/models/shopping-list.model';
import { signal } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListComponent {
  private shoppingListService = inject(ShoppingListService);
  private dialog = inject(MatDialog);

  shoppingItems = signal<ShoppingListItem[]>([]);
  loading = signal(false);

  constructor() {
    this.loadInitialItems();
  }

  private loadInitialItems(): void {
    this.loading.set(true);
    this.shoppingListService.getAll().subscribe({
      next: items => {
        this.shoppingItems.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddShoppingListDialogWrapperComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadItems();
      }
    });
  }

  editList(item: ShoppingListItem): void {
    const dialogRef = this.dialog.open(AddShoppingListDialogWrapperComponent, { data: item });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadItems();
      }
    });
  }

  deleteList(id: string): void {
    this.loading.set(true);
    this.shoppingListService.delete(id).subscribe(() => {
      this.reloadItems();
      this.loading.set(false);
    }, () => {
      this.loading.set(false);
    });
  }

  private reloadItems(): void {
    this.loading.set(true);
    this.shoppingListService.getAll().subscribe({
      next: items => {
        this.shoppingItems.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
