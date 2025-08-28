import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VehicleService } from '../../core/services/vehicle.service';
import { Observable } from 'rxjs';
import { Car } from '../../shared/models/car.model';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesComponent {
  vehicles: Car[] = [];
  error: string | null = null;
  loading = true;

  constructor(private vehicleService: VehicleService) {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.loading = false;
        if (!vehicles || vehicles.length === 0) {
          this.error = 'No vehicles found or failed to load vehicles.';
        }
      },
      error: () => {
        this.error = 'Failed to load vehicles.';
        this.loading = false;
      }
    });
  }
}
