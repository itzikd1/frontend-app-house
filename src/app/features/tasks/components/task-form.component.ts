import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';

export interface TaskFormData {
  title: string;
  description?: string;
  categoryId?: string;
  priority?: 'Low' | 'Medium' | 'High';
  repeatFrequency?: string;
  dueDate?: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required>
        <mat-error *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
          Title is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="3"></textarea>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Category</mat-label>
        <mat-select formControlName="categoryId">
          <mat-option value="">No Category</mat-option>
          <mat-option *ngFor="let category of categories" [value]="category.id">
            {{ category.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Priority</mat-label>
        <mat-select formControlName="priority">
          <mat-option value="Low">Low</mat-option>
          <mat-option value="Medium">Medium</mat-option>
          <mat-option value="High">High</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Due Date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="dueDate">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Repeat Frequency</mat-label>
        <mat-select formControlName="repeatFrequency">
          <mat-option value="None">None</mat-option>
          <mat-option value="Daily">Daily</mat-option>
          <mat-option value="Weekly">Weekly</mat-option>
          <mat-option value="Monthly">Monthly</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
          {{ submitButtonText() }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {
  @Input() initialData: TaskFormData | null = null;
  @Input() categories: TaskCategory[] = [];
  @Input() isEditMode = false;

  @Output() formSubmit = new EventEmitter<TaskFormData>();
  @Output() formCancel = new EventEmitter<void>();

  public readonly taskForm: FormGroup;

  public readonly submitButtonText = computed(() =>
    this.isEditMode ? 'Update Task' : 'Add Task'
  );

  constructor(private readonly fb: FormBuilder) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.taskForm.patchValue(this.initialData);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      categoryId: [''],
      priority: ['Medium'],
      repeatFrequency: ['None'],
      dueDate: [''],
    });
  }

  public onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value as TaskFormData;
      this.formSubmit.emit(formValue);
    }
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
