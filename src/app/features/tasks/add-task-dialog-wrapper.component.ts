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
  public isEditMode = false;
  public task = signal<Partial<Task>>({
    title: '',
    description: '',
    categoryId: '',
    priority: 'Medium',
    repeatFrequency: 'None',
    dueDate: '',
  });

  public categories = signal<TaskCategory[]>([]);
  public categoriesLoading = signal<boolean>(false);
  public categoriesError = signal<string | null>(null);

  private dialogRef = inject(MatDialogRef<AddTaskDialogWrapperComponent>);
  private categoryService = inject(TaskCategoryService);
  private data = inject(MAT_DIALOG_DATA) as { task?: Task } | undefined;

  constructor() {
    this.isEditMode = !!this.data?.task;
    if (this.isEditMode && this.data?.task) {
      const normalizedTask: Partial<Task> = {
        ...this.data.task,
        categoryId: String(this.data.task.categoryId ?? this.data.task.category?.id ?? ''),
      };
      this.task.set(normalizedTask);
    }
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoriesLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (cats: TaskCategory[]) => {
        this.categories.set(cats);
        this.categoriesLoading.set(false);
      },
      error: () => {
        this.categoriesError.set('Failed to load categories.');
        this.categoriesLoading.set(false);
      }
    });
  }

  public onSubmit(): void {
    this.dialogRef.close(this.task());
  }

  public onCancel(): void {
    this.dialogRef.close(null);
  }

  public onTitleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.task.update(t => ({ ...t, title: value }));
  }

  public onDescriptionChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.task.update(t => ({ ...t, description: value }));
  }

  public onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const allowedPriorities = ['Low', 'Medium', 'High'];
    this.task.update(t => ({
      ...t,
      priority: allowedPriorities.includes(value) ? value as 'Low' | 'Medium' | 'High' : undefined,
    }));
  }

  public onDueDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.task.update(t => ({ ...t, dueDate: value }));
  }

  public onRepeatChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.task.update(t => ({ ...t, repeatFrequency: value }));
  }
}
