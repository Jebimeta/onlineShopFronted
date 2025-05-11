import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../environments/environments';
import { Observable, catchError, map, of } from 'rxjs';
import { ProductResponse, Product } from '../../shared/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environments.baseProductsURL;

  private http = inject( HttpClient );

  getProducts():Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.baseUrl + '/products');
  }

  getProductById( id: number ): Observable<ProductResponse | undefined> {
    return this.http.get<ProductResponse>(this.baseUrl + '/product/'+ id )
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.baseUrl + '/create-product', product);
  }

  updateProduct(product: FormData, id: number): Observable<Product> {
    return this.http.patch<Product>(this.baseUrl + '/update-product/' + id, product);
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete(this.baseUrl + '/product/delete-product/'+ id )
      .pipe(
        map(resp => true),
        catchError(error => {
          console.error('Delete product failed', error);
          return of(false);
        })
      );
  }


}
