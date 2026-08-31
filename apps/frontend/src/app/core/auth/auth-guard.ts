import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Only lets authenticated organizers through, otherwise sends them to login.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? true : inject(Router).parseUrl('/login');
};

/**
 * For login/signup pages: an authenticated organizer goes straight to the dashboard.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? inject(Router).parseUrl('/dashboard') : true;
};
