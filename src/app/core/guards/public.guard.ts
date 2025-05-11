import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
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
    return of(true).pipe(
      tap(() => router.navigate(['./'])),
      map(() => false)
    );
  } else {
    return of(true);
  }
};

export const canMatchGuardPublic: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return checkAuthStatus();
};

export const canActivateGuardPublic: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return checkAuthStatus();
};
