import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  @Input() item: unknown = null;
  @Input() completed: boolean = false;
  @Input() showCheckbox: boolean = false;
  @Output() edit = new EventEmitter<unknown>();
  @Output() delete = new EventEmitter<unknown>();
  @Output() toggleComplete = new EventEmitter<boolean>();

  onToggleComplete(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleComplete.emit(checked);
  }
}
