import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';

@Component({
  selector: 'app-add-category-dialog-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    ModalDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-category-dialog-wrapper.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCategoryDialogWrapperComponent {
  isEditMode: boolean = false;
  categoryName: string = '';
  categoryId: string | null = null;

  private dialogRef = inject(MatDialogRef<AddCategoryDialogWrapperComponent>);
  public data: unknown = inject(MAT_DIALOG_DATA);

  constructor() {
    const data = this.data as { category?: { name: string; id: string } };
    this.isEditMode = !!data?.category;
    if (this.isEditMode && data.category) {
      this.categoryName = data.category.name;
      this.categoryId = data.category.id;
    }
  }

  onSubmit(): void {
    if (this.categoryName.trim()) {
      if (this.isEditMode) {
        this.dialogRef.close({
          name: this.categoryName.trim(),
          id: this.categoryId,
          isEdit: true,
        });
      } else {
        this.dialogRef.close({name: this.categoryName.trim()});
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
