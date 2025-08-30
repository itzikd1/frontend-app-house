import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car } from '../../core/services/car.service';
import { ItemListComponent } from '../../shared/components/item-list/item-list.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddCarDialogWrapperComponent } from './add-car-dialog-wrapper.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemListComponent,
    FabButtonComponent,
    ItemCardComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarsComponent implements OnInit {
  cars = signal<Car[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  adding = signal<boolean>(false);
  newCar = signal<Partial<Car>>({ make: '', model: '', year: new Date().getFullYear(), licensePlate: '' });

  private carService = inject(CarService);
  private dialog = inject(MatDialog);

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
    const dialogRef = this.dialog.open(AddCarDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: Partial<Car> | null) => {
      if (result && result.make && result.model) {
        this.addCar(result);
      }
    });
  }

  addCar(car?: Partial<Car>): void {
    if (this.adding()) return;
    const carToAdd = car ?? this.newCar();
    if (!carToAdd.make || !carToAdd.model) return;
    this.adding.set(true);
    this.carService.create(carToAdd).subscribe({
      next: (createdCar: Car) => {
        this.cars.set([createdCar, ...this.cars()]);
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
