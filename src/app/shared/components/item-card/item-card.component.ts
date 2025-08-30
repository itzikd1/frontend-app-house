import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="item-card">
      <div class="item-header">
        <input
          *ngIf="showCheckbox"
          type="checkbox"
          class="item-complete-checkbox"
          [checked]="completed"
          (change)="onToggleComplete($event)"
          aria-label="Mark as complete"
        />
        <strong class="item-title">{{ item?.title }}</strong>
        <div class="item-actions">
          <button type="button" class="icon-btn edit" (click)="edit.emit(item)" title="Edit">
            <mat-icon aria-label="Edit">edit</mat-icon>
          </button>
          <button type="button" class="icon-btn delete" (click)="delete.emit(item)" title="Delete">
            <mat-icon aria-label="Delete">delete</mat-icon>
          </button>
        </div>
      </div>
      <div class="item-body">
        <span *ngIf="item?.description" class="item-desc">{{ item?.description }}</span>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  @Input() item: Item | null = null;
  @Input() completed: boolean = false;
  @Input() showCheckbox: boolean = false;
  @Output() edit = new EventEmitter<Item | null>();
  @Output() delete = new EventEmitter<Item | null>();
  @Output() toggleComplete = new EventEmitter<boolean>();

  onToggleComplete(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleComplete.emit(checked);
  }
}
