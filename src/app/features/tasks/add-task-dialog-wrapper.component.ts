import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Task} from '../../core/interfaces/task.model';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {ModalDialogComponent} from '../../shared/components/modal-dialog.component';
import {TaskCategoryService} from '../../core/services/item-category.service';
import {signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskCategory} from '../../core/interfaces/item-category.model';

@Component({
  selector: 'app-add-task-dialog-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    ModalDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './add-task-dialog-wrapper.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskDialogWrapperComponent {
  isEditMode: boolean = false;
  task = signal<Partial<Task>>({
    title: '',
    description: '',
    categoryId: '',
    priority: 'Medium',
    dueDate: '',
    repeat: 'None',
  });

  categories = signal<TaskCategory[]>([]);
  categoriesLoading = signal<boolean>(false);
  categoriesError = signal<string | null>(null);

  private dialogRef = inject(MatDialogRef<AddTaskDialogWrapperComponent>);
  public data: unknown = inject(MAT_DIALOG_DATA);
  private categoryService = inject(TaskCategoryService);

  constructor() {
    const data = this.data as { task?: Task };
    this.isEditMode = !!data?.task;
    if (this.isEditMode && data.task) {
      // Normalize categoryId: always a string
      const normalizedTask: Partial<Task> = {
        ...data.task,
        categoryId: String(data.task.categoryId ?? data.task.category?.id ?? ''),
      };
      this.task.set(normalizedTask);
    }
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoriesLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: cats => {
        this.categories.set(cats);
        this.categoriesLoading.set(false);
      },
      error: () => {
        this.categoriesError.set('Failed to load categories.');
        this.categoriesLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.dialogRef.close(this.task());
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onTitleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.task.update(t => ({...t, title: value}));
  }

  onDescriptionChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.task.update(t => ({...t, description: value}));
  }

  onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const allowedPriorities = ['Low', 'Medium', 'High'];
    this.task.update(t => ({
      ...t,
      priority: allowedPriorities.includes(value) ? value as 'Low' | 'Medium' | 'High' : undefined,
    }));
  }

  onDueDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.task.update(t => ({...t, dueDate: value}));
  }

  onRepeatChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.task.update(t => ({...t, repeat: value}));
  }
}
