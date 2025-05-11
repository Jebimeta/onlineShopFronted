import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../environments/environments';
import { Observable, catchError, map, of } from 'rxjs';
import { Customer } from '../../shared/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl: string = environments.baseUsersUrl;

  private authUrl: string = environments.baseAuthUrl;

  private http = inject( HttpClient );

  getUsers():Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  getUserByEmail( email: string ): Observable<Customer | undefined> {
    return this.http.get<Customer>(this.baseUrl + '/'+ email )
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  deactivateUser(email: string): Observable<Customer | undefined> {
    return this.http.patch<Customer>(`${this.baseUrl}/delete/${email}`, null)
      .pipe(
        catchError(error => of(undefined))
      );
  }

  updateUser(user: Customer): Observable<Customer | undefined> {
    return this.http.patch<Customer>(`${this.baseUrl}/update-user`, user)
      .pipe(
        catchError(error => of(undefined))
      );
  }

  getAuthenticatedUser(): Observable<Customer> {
    return this.http.get<Customer>(`${this.authUrl}/authenticated-user`);
  }

}
