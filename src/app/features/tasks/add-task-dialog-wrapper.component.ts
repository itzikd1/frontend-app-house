import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../shared/models/task.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';
import { TaskCategoryService, TaskCategory } from '../../core/services/item-category.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  template: `
    <app-modal-dialog
      [title]="isEditMode ? 'Edit Task' : 'Create New Task'"
      [submitLabel]="isEditMode ? 'Save Changes' : 'Create Task'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <div class="form-group">
        <label for="title" class="input-label">Title *</label>
        <input id="title" type="text" placeholder="Task title"
          [value]="task().title"
          (input)="onTitleChange($event)"
          name="title" required />
      </div>
      <div class="form-group">
        <label for="description" class="input-label">Description</label>
        <textarea id="description" placeholder="Enter task description"
          [value]="task().description"
          (input)="onDescriptionChange($event)"
          name="description"></textarea>
      </div>
      <div class="form-group">
        <label for="category" class="input-label">Category</label>
        <mat-form-field appearance="fill">
          <mat-select id="category" [(ngModel)]="task().categoryId" name="categoryId" required>
            <mat-option *ngFor="let category of categories()" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="form-group">
        <label for="priority" class="input-label">Priority</label>
        <select id="priority"
          [value]="task().priority"
          (change)="onPriorityChange($event)"
          name="priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div class="form-group">
        <label for="dueDate" class="input-label">Due Date</label>
        <input id="dueDate" type="date"
          [value]="task().dueDate"
          (input)="onDueDateChange($event)"
          name="dueDate" />
      </div>
      <div class="form-group">
        <label for="repeat" class="input-label">Repeat</label>
        <select id="repeat"
          [value]="task().repeat"
          (change)="onRepeatChange($event)"
          name="repeat">
          <option value="None">None</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>
    </app-modal-dialog>
  `,
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
      this.task.set(data.task);
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
    this.task.update(t => ({ ...t, title: value }));
  }

  onDescriptionChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.task.update(t => ({ ...t, description: value }));
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.task.update(t => ({ ...t, categoryId: value }));
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
    this.task.update(t => ({ ...t, dueDate: value }));
  }

  onRepeatChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.task.update(t => ({ ...t, repeat: value }));
  }
}
