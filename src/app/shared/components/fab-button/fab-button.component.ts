import { Component, Input, Output, EventEmitter } from '@angular/core';
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
            (click)="click.emit()"
            [attr.aria-label]="ariaLabel">
      <mat-icon>{{ icon }}</mat-icon>
    </button>
  `,
  styleUrls: ['./fab-button.component.scss']
})
export class FabButtonComponent {
  @Input() icon = 'add';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() ariaLabel = 'Add';
  @Output() click = new EventEmitter<void>();
}
