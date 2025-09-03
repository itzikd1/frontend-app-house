import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fab-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabButtonComponent {
  @Input() icon = 'add';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() ariaLabel = 'Add';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.buttonClick.emit();
  }
}
