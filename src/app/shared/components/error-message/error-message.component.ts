import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input() translationKey!: string;
}
