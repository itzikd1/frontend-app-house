export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp: string;
}

export interface Car extends BaseModel {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  userId: string;
  currentLocation?: Location;
}
