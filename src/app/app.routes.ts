import { Routes } from '@angular/router';
import authGuard from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard | House Manager',
    data: {
      title: 'dashboard',
      icon: 'dashboard'
    }
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent),
    canActivate: [authGuard],
    title: 'Tasks | House Manager',
    data: {
      title: 'TASKS',
      icon: 'checklist'
    }
  },
  {
    path: 'family',
    loadComponent: () => import('./features/family/family.component').then(m => m.FamilyComponent),
    canActivate: [authGuard],
    title: 'Family | House Manager',
    data: {
      title: 'FAMILY',
      icon: 'people'
    }
  },
  {
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipes.component').then(m => m.RecipesComponent),
    canActivate: [authGuard],
    title: 'Recipes | House Manager',
    data: {
      title: 'RECIPES',
      icon: 'restaurant'
    }
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Profile | House Manager',
    data: {
      title: 'PROFILE',
      icon: 'person'
    }
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard],
    title: 'Settings | House Manager',
    data: {
      title: 'SETTINGS',
      icon: 'settings'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'Login | House Manager',
    data: {
      title: 'LOGIN',
      icon: 'login'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
    title: 'Register | House Manager',
    data: {
      title: 'REGISTER',
      icon: 'person_add'
    }
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard],
    title: 'Users | House Manager',
    data: {
      title: 'USERS',
      icon: 'person'
    }
  },
  {
    path: 'cars',
    loadComponent: () => import('./features/cars/cars.component').then(m => m.CarsComponent),
    canActivate: [authGuard],
    title: 'Cars | House Manager',
    data: {
      title: 'CARS',
      icon: 'directions_car'
    }
  },
  {
    path: 'notes',
    loadComponent: () => import('./features/notes/notes.component').then(m => m.NotesComponent),
    canActivate: [authGuard],
    title: 'Notes | House Manager',
    data: {
      title: 'NOTES',
      icon: 'note'
    }
  },
  {
    path: 'goals',
    loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent),
    canActivate: [authGuard],
    title: 'Goals | House Manager',
    data: {
      title: 'GOALS',
      icon: 'flag'
    }
  },
];
