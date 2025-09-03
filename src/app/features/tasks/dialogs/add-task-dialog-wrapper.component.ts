import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../../core/interfaces/task.model';
import { ModalDialogComponent } from '../../../shared/components/modal-dialog.component';
import { TaskCategoryService } from '../../../core/services/item-category.service';
import { CommonModule } from '@angular/common';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { TaskFormComponent, TaskFormData } from '../components/task-form.component';

@Component({
  selector: 'app-add-task-dialog-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    ModalDialogComponent,
    TaskFormComponent,
  ],
  templateUrl: './add-task-dialog-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskDialogWrapperComponent implements OnInit {
  public readonly isEditMode: boolean;
  public readonly dialogTitle: string;
  public readonly initialFormData: TaskFormData | null;
  public readonly categories = signal<TaskCategory[]>([]);

  private readonly dialogRef = inject(MatDialogRef<AddTaskDialogWrapperComponent>);
  private readonly categoryService = inject(TaskCategoryService);
  private readonly data = inject(MAT_DIALOG_DATA) as { task?: Task } | undefined;

  constructor() {
    this.isEditMode = !!this.data?.task;
    this.dialogTitle = this.isEditMode ? 'Edit Task' : 'Add New Task';
    this.initialFormData = this.data?.task ? this.mapTaskToFormData(this.data.task) : null;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private mapTaskToFormData(task: Task): TaskFormData {
    return {
      title: task.title,
      description: task.description || '',
      categoryId: String(task.categoryId ?? task.category?.id ?? ''),
      priority: task.priority,
      repeatFrequency: task.repeatFrequency || 'None',
      dueDate: task.dueDate || '',
    };
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (cats: TaskCategory[]) => {
        this.categories.set(cats);
      },
      error: (error: {error: string}) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  public onFormSubmit(formData: TaskFormData): void {
    this.dialogRef.close(formData);
  }

  public onFormCancel(): void {
    this.dialogRef.close(null);
  }
}
