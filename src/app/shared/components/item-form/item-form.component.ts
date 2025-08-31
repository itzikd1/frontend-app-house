import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFormComponent {
  @Input() submitLabel = 'Add';
  @Output() formSubmit = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmit.emit();
  }
}
