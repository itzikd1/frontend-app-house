import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, OnInit, inject } from '@angular/core';
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
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {
  @Input() initialData: TaskFormData | null = null;
  @Input() categories: TaskCategory[] = [];
  @Input() isEditMode = false;

  @Output() formSubmit = new EventEmitter<TaskFormData>();
  @Output() formCancel = new EventEmitter<void>();

  public readonly taskForm: FormGroup = inject(FormBuilder).group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    categoryId: [''],
    priority: ['Medium'],
    repeatFrequency: ['None'],
    dueDate: [''],
  });

  public readonly submitButtonText = computed(() =>
    this.isEditMode ? 'Update Task' : 'Add Task'
  );

  ngOnInit(): void {
    if (this.initialData) {
      this.taskForm.patchValue(this.initialData);
    }
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
