import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car } from '../../core/services/car.service';
import { ItemListComponent } from '../../shared/components/item-list/item-list.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { ItemDialogComponent } from '../../shared/components/item-dialog/item-dialog.component';
import { ItemFormComponent } from '../../shared/components/item-form/item-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemListComponent,
    FabButtonComponent,
    ItemCardComponent,
    ItemDialogComponent,
    ItemFormComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarsComponent implements OnInit {
  cars = signal<Car[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  showDialog = signal<boolean>(false);
  adding = signal<boolean>(false);
  newCar = signal<Partial<Car>>({ make: '', model: '', year: new Date().getFullYear(), licensePlate: '' });

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars(): void {
    this.loading.set(true);
    this.carService.getAll().subscribe({
      next: cars => {
        this.cars.set(cars);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load cars');
        this.loading.set(false);
      }
    });
  }

  openAddDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.newCar.set({ make: '', model: '', year: new Date().getFullYear(), licensePlate: '' });
  }

  addCar(): void {
    if (this.adding()) return;
    if (!this.newCar().make || !this.newCar().model) return;
    this.adding.set(true);
    this.carService.create(this.newCar()).subscribe({
      next: (car: Car) => {
        this.cars.set([car, ...this.cars()]);
        this.closeDialog();
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add car');
        this.adding.set(false);
      }
    });
  }

  deleteCar(car: Car): void {
    this.loading.set(true);
    this.carService.delete(car.id).subscribe({
      next: () => {
        this.cars.set(this.cars().filter((c: Car) => c.id !== car.id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete car');
        this.loading.set(false);
      }
    });
  }
}
