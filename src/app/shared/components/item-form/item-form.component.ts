import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #form="ngForm" class="item-form">
      <ng-content></ng-content>
      <button type="submit" [disabled]="form.invalid">{{ submitLabel }}</button>
    </form>
  `,
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent {
  @Input() submitLabel = 'Add';
  @Output() submit = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
  }
}

