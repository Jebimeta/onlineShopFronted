import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { CartResponse, Cart } from '../../shared/models/cart.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl: string = environments.baseProductsURL;
  private baseCartUrl: string = environments.baseCartURL;
  private http = inject( HttpClient );

  getCarts():Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(this.baseUrl + '/carts');
  }

  getCartById( id: number ): Observable<CartResponse | undefined> {
    return this.http.get<CartResponse>(this.baseUrl + '/cart/'+ id )
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  createCart(cart: FormData): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl + '/create-cart', cart);
  }

  addProductToCart(cartId: number, product: { productId: number; quantity: number }): Observable<Cart> {
    const url = `${this.baseCartUrl}/${cartId}/add-product`;
    return this.http.post<Cart>(url, product);
  }

  deleteCart(cartId: number): Observable<string> {
    const url = `${this.baseCartUrl}/delete-cart/${cartId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  removeProductFromCart(cartId: number, cartDetailsId: number): Observable<string> {
    const url = `${this.baseCartUrl}/${cartId}/remove-product/${cartDetailsId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

}
