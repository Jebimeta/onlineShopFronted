import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import AuthService from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  const publicUrls = ['/auth/register', '/auth/login'];

  // Si la URL es pública, procesa la solicitud sin modificar
  if (publicUrls.some(url => request.url.includes(url))) {
    return next(request);
  }
  const refreshToken = authService.getRefreshToken();
  let token = authService.getToken();

  const isTokenExpired = (token: string): boolean => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;
    return Date.now() > expirationDate;
  };

  if (token && !isTokenExpired(token)) {
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  } else if (refreshToken) {
      return authService.refreshToken().pipe(
        switchMap((response) => {
          authService.saveToken(response.accessToken);

          if (response.refreshToken) {
            authService.saveRefreshToken(response.refreshToken);
          }

          token = response.accessToken;

          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });

          return next(authReq);
        }),
        catchError(refreshError => {
          console.error('Error al refrescar el token', refreshError);
          authService.logout();
          return throwError(() => refreshError);
        })
      );
  } else {
      console.warn("No hay token ni refresh token. La solicitud se procesará sin el encabezado de autorización.");
      return next(request);
  }
};
