import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FamilyService } from '../../core/services/family.service';
import { Observable } from 'rxjs';
import { Family } from '../../shared/models/family.model';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './family.component.html',
  styleUrl: './family.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyComponent {
  families: Family[] = [];
  error: string | null = null;
  loading = true;

  constructor(private familyService: FamilyService) {
    this.familyService.getFamilies().subscribe({
      next: (families) => {
        this.families = families;
        this.loading = false;
        if (!families || families.length === 0) {
          this.error = 'No families found or failed to load families.';
        }
      },
      error: () => {
        this.error = 'Failed to load families.';
        this.loading = false;
      }
    });
  }
}
