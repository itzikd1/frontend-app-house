import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <ng-container *ngIf="loading; else showList">
      <app-loading-spinner></app-loading-spinner>
    </ng-container>
    <ng-template #showList>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="items?.length; else emptyState" class="items-grid">
        <ng-content></ng-content>
      </div>
      <ng-template #emptyState>
        <p class="empty">{{ emptyMessage }}</p>
      </ng-template>
    </ng-template>
  `,
  styleUrls: ['./item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent {
  @Input() items: unknown[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() emptyMessage = 'No items found.';
}
