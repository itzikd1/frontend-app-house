import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard | House Manager',
    data: {
      title: 'DASHBOARD',
      icon: 'dashboard'
    }
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent),
    title: 'Tasks | House Manager',
    data: {
      title: 'TASKS',
      icon: 'checklist'
    }
  },
  {
    path: 'family',
    loadComponent: () => import('./features/family/family.component').then(m => m.FamilyComponent),
    title: 'Family | House Manager',
    data: {
      title: 'FAMILY',
      icon: 'people'
    }
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/vehicles.component').then(m => m.VehiclesComponent),
    title: 'Vehicles | House Manager',
    data: {
      title: 'VEHICLES',
      icon: 'directions_car'
    }
  },
  {
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipes.component').then(m => m.RecipesComponent),
    title: 'Recipes | House Manager',
    data: {
      title: 'RECIPES',
      icon: 'restaurant'
    }
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.default)],
    title: 'Profile | House Manager',
    data: {
      title: 'PROFILE',
      icon: 'person'
    }
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.default)],
    title: 'Settings | House Manager',
    data: {
      title: 'SETTINGS',
      icon: 'settings'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
    title: 'Register | House Manager',
    data: {
      title: 'register.title',
      icon: 'person_add'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'Login | House Manager',
    data: {
      title: 'login.title',
      icon: 'login'
    }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
