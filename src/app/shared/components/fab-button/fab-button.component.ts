import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fab-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button mat-fab
            [color]="color"
            class="fab"
            (click)="onClick($event)"
            [attr.aria-label]="ariaLabel">
      <mat-icon>{{ icon }}</mat-icon>
    </button>
  `,
  styleUrls: ['./fab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabButtonComponent {
  @Input() icon = 'add';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() ariaLabel = 'Add';
  @Output() fabClick = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.fabClick.emit();
  }
}
