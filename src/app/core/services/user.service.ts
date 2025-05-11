import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { Observable } from 'rxjs';
import { CustomerResponse } from '../../shared/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environments.baseUsersUrl;

  private http = inject( HttpClient );

  getCustomers():Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.baseUrl);
  }

}
