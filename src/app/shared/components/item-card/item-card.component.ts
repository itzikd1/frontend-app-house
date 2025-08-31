import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './item-card.component.html',
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
