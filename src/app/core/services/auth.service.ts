import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { Customer } from '../../shared/models/customer.model';
import { Login } from '../../shared/models/login.model';
import { RegisterResponse } from '../../shared/models/register';
import { LoginResponse } from '../../shared/models/login.model';

@Injectable({providedIn: 'root'})
export default class AuthService {

  private baseUrl: string = environments.baseAuthUrl;
  private user?: Customer ;

  private http = inject( HttpClient );

  get currentUser(): Customer | undefined {
    if ( !this.user ) return undefined;
    return structuredClone( this.user ) ;
  }

  register(user: Customer): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.baseUrl + '/register', user);
  }


  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/login', credentials);
  }

  verify(token: string): Observable<LoginResponse> {
    console.log('Llamando al servicio de verificación con token:', token);
    return this.http.post<LoginResponse>(this.baseUrl + '/verify/' + token, null);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh-token');

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });


    return this.http.post<LoginResponse>(
      `${this.baseUrl}/refresh-token`,
      {},
      { headers }
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }


  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh-token', refreshToken);
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  logout(): void {
    console.log("Ha cerrado sesión correctamente");
    this.user = undefined;
    localStorage.clear();
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error('Invalid token format:', e);
      return null;
    }
  }

  isAdmin(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.role === 'ADMIN';
  }


}
