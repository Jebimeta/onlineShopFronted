import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CanActivateFn, CanMatchFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import AuthService from '../services/auth.service';

const checkAuthStatus = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const isTokenExpired = (token: string): boolean => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;
    return Date.now() > expirationDate;
  };

  if (token && !isTokenExpired(token)) {
    return of(true);
  } else {
    router.navigate(['/auth/login']);
    return of(false);
  }
};

export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return checkAuthStatus();
};

export const canActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return checkAuthStatus();
};
