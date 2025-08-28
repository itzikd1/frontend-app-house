import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessMessageComponent {
  @Input() message!: string;
}

