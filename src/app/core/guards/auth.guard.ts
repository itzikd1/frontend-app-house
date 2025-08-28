import { CanActivateFn } from '@angular/router';

const authGuard: CanActivateFn = (route, state) => {
  // TODO: Replace with real authentication logic
  const isAuthenticated = true; // Stub: always allow
  return isAuthenticated;
};

export default authGuard;
