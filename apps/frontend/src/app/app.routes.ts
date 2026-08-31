import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    // public attendee page
    path: 'c/:publicId',
    loadComponent: () =>
      import('./features/attendee/conference-page/conference-page').then((m) => m.ConferencePage),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/admin/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'conferences/new',
        loadComponent: () =>
          import('./features/admin/conference-form/conference-form').then((m) => m.ConferenceForm),
      },
      {
        path: 'conferences/:id/edit',
        loadComponent: () =>
          import('./features/admin/conference-form/conference-form').then((m) => m.ConferenceForm),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
