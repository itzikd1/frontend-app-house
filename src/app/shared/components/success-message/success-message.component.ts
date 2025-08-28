import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessMessageComponent {
  @Input() translationKey!: string;
}
