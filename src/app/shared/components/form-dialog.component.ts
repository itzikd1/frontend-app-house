import { Component, Inject, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  validators?: any[];
  options?: { value: any; label: string }[];
  placeholder?: string;
}

export interface FormDialogConfig {
  title: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
  cancelLabel?: string;
  initialData?: any;
}

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ config.title }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-fields">
            <ng-container *ngFor="let field of config.fields">

              <!-- Text Input -->
              <mat-form-field *ngIf="field.type === 'text'" appearance="outline">
                <mat-label>{{ field.label }}</mat-label>
                <input
                  matInput
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                >
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </mat-form-field>

              <!-- Textarea -->
              <mat-form-field *ngIf="field.type === 'textarea'" appearance="outline">
                <mat-label>{{ field.label }}</mat-label>
                <textarea
                  matInput
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <!-- Select -->
              <mat-form-field *ngIf="field.type === 'select'" appearance="outline">
                <mat-label>{{ field.label }}</mat-label>
                <mat-select [formControlName]="field.key">
                  <mat-option
                    *ngFor="let option of field.options"
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Date -->
              <mat-form-field *ngIf="field.type === 'date'" appearance="outline">
                <mat-label>{{ field.label }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  [formControlName]="field.key"
                >
                <mat-hint>MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

            </ng-container>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button
            mat-button
            type="button"
            (click)="onCancel()"
          >
            {{ config.cancelLabel || 'Cancel' }}
          </button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="form.invalid"
          >
            {{ config.submitLabel || 'Submit' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
      max-width: 600px;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
      gap: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormDialogComponent implements OnInit {
  public form: FormGroup;

  private readonly dialogRef = inject(MatDialogRef<FormDialogComponent>);
  private readonly fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public config: FormDialogConfig) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.config.initialData) {
      this.form.patchValue(this.config.initialData);
    }
  }

  private createForm(): FormGroup {
    const formControls: { [key: string]: any } = {};

    this.config.fields.forEach(field => {
      const validators = field.validators || [];
      formControls[field.key] = ['', validators];
    });

    return this.fb.group(formControls);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  public onCancel(): void {
    this.dialogRef.close(null);
  }
}
