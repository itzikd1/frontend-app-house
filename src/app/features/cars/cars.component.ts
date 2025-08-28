import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService, Car } from '../../core/services/car.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarsComponent implements OnInit {
  cars = signal<Car[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.getAll().subscribe({
      next: cars => {
        this.cars.set(cars);
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Failed to load cars');
        this.loading.set(false);
      }
    });
  }
}

