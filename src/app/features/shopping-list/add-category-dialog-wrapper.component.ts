import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingCategory } from '../../core/interfaces/shopping-category.model';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';

@Component({
  selector: 'app-add-category-dialog-wrapper',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-category-dialog-wrapper.component.html',
  styleUrls: ['./add-category-dialog-wrapper.component.scss']
})
export class AddCategoryDialogWrapperComponent {
  public categoryName: string;
  public isEditMode: boolean;
  public dialogRef = inject(MatDialogRef<AddCategoryDialogWrapperComponent>);
  public data = inject(MAT_DIALOG_DATA) as { category?: ShoppingCategory };

  constructor() {
    this.isEditMode = !!this.data?.category;
    this.categoryName = this.data?.category?.name || '';
  }

  onSubmit(): void {
    if (!this.categoryName.trim()) return;
    this.dialogRef.close({ name: this.categoryName.trim() });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
