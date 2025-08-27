import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { FamilyComponent } from './features/family/family.component';
import { VehiclesComponent } from './features/vehicles/vehicles.component';
import { RecipesComponent } from './features/recipes/recipes.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard | House Manager',
    data: {
      title: 'DASHBOARD',
      icon: 'dashboard'
    }
  },
  {
    path: 'tasks',
    component: TasksComponent,
    title: 'Tasks | House Manager',
    data: {
      title: 'TASKS',
      icon: 'checklist'
    }
  },
  {
    path: 'family',
    component: FamilyComponent,
    title: 'Family | House Manager',
    data: {
      title: 'FAMILY',
      icon: 'people'
    }
  },
  {
    path: 'vehicles',
    component: VehiclesComponent,
    title: 'Vehicles | House Manager',
    data: {
      title: 'VEHICLES',
      icon: 'directions_car'
    }
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    title: 'Recipes | House Manager',
    data: {
      title: 'RECIPES',
      icon: 'restaurant'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile | House Manager',
    data: {
      title: 'PROFILE',
      icon: 'person'
    }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings | House Manager',
    data: {
      title: 'SETTINGS',
      icon: 'settings'
    }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
