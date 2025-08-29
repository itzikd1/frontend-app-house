import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
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
  template: `
    <app-modal-dialog
      [title]="isEditMode ? 'Edit Category' : 'Create New Category'"
      [submitLabel]="isEditMode ? 'Save Changes' : 'Create Category'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <div class="form-group">
        <label for="categoryName" class="input-label">Category Name *</label>
        <input id="categoryName" type="text" placeholder="Category name"
          [(ngModel)]="categoryName"
          name="categoryName" required />
      </div>
    </app-modal-dialog>
  `,
  styleUrls: ['./add-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCategoryDialogWrapperComponent {
  isEditMode: boolean = false;
  categoryName: string = '';
  categoryId: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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
        this.dialogRef.close(this.categoryName.trim());
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
