import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  validators?: ValidatorFn[];
  options?: FormFieldOption[];
  placeholder?: string;
}

export interface FormDialogConfig {
  title: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
  cancelLabel?: string;
  initialData?: Record<string, string | number | Date>;
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
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormDialogComponent implements OnInit {
  public form: FormGroup;

  private readonly dialogRef = inject(MatDialogRef<FormDialogComponent>);
  private readonly fb = inject(FormBuilder);
  public readonly config: FormDialogConfig = inject(MAT_DIALOG_DATA);

  constructor() {
    this.form = this.createForm();
  }

  public ngOnInit(): void {
    if (this.config.initialData) {
      this.form.patchValue(this.config.initialData);
    }
  }

  private createForm(): FormGroup {
    const formControls: Record<string, [string, ValidatorFn[]]> = {};

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
