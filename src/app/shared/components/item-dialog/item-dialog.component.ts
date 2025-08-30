import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 class="dialog-title">{{ title }}</h2>
    <ng-content></ng-content>
    <div class="dialog-actions">
      <button type="button" class="btn cancel" (click)="formCancel.emit()">Cancel</button>
    </div>
  `,
  styleUrls: ['./item-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDialogComponent {
  @Input() title = 'Add Item';
  @Input() submitLabel = 'Add';
  @Output() formSubmit = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();
}
