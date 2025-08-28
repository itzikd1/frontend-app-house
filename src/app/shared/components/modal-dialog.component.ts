import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">{{ title }}</div>
      <form class="dialog-form" (ngSubmit)="onSubmit()" #form="ngForm">
        <ng-content></ng-content>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">{{ submitLabel }}</button>
          <button mat-button type="button" (click)="onCancel()">{{ cancelLabel }}</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {
  @Input() title = '';
  @Input() submitLabel = 'Submit';
  @Input() cancelLabel = 'Cancel';
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

