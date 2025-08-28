import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 class="dialog-title">{{ title }}</h2>
    <ng-content></ng-content>
    <div class="dialog-actions">
      <button type="button" class="btn cancel" (click)="cancel.emit()">Cancel</button>
    </div>
  `,
  styleUrls: ['./item-dialog.component.scss']
})
export class ItemDialogComponent {
  @Input() title = 'Add Item';
  @Input() submitLabel = 'Add';
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
