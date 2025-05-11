import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CartResponse } from '../../../shared/models/cart.model';

@Component({
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export default class CartComponent implements OnInit {
  public cartService = inject(CartService);
  public carts: CartResponse[] = [];
  public selectedCart: CartResponse | null = null;
  public message: string | null = null;

  ngOnInit(): void {
    this.loadCarts();
  }


  loadCarts(): void {
    this.cartService.getCarts().subscribe({
      next: (carts) => {
        this.carts = carts;
      },
      error: (err) => {
        console.error('Error al cargar los carritos:', err);
      },
    });
  }


  loadCartById(cartId: number): void {
    this.cartService.getCartById(cartId).subscribe({
      next: (cart) => {
        this.selectedCart = cart || null;
        if (!cart) {
          this.message = `El carrito con ID ${cartId} no fue encontrado.`;
        }
      },
      error: (err) => {
        console.error('Error al cargar el carrito:', err);
      },
    });
  }

  createCart(): void {
    const newCart = new FormData();

    this.cartService.createCart(newCart).subscribe({
      next: (cart) => {
        this.message = 'Carrito creado con éxito.';
        this.loadCarts();
      },
      error: (err) => {
        console.error('Error al crear el carrito:', err);
      },
    });
  }

  addProduct(cartId: number, productId: number, quantity: number): void {
    const product = { productId, quantity };

    this.cartService.addProductToCart(cartId, product).subscribe({
      next: (cart) => {
        this.message = `Producto añadido al carrito con ID ${cartId}.`;
        this.loadCartById(cartId); // Recarga el carrito actualizado
      },
      error: (err) => {
        console.error('Error al añadir el producto al carrito:', err);
      },
    });
  }

  deleteCart(cartId: number): void {
    this.cartService.deleteCart(cartId).subscribe({
      next: (response) => {
        this.message = response;
        this.loadCarts();
      },
      error: (err) => {
        console.error('Error al eliminar el carrito:', err);
      },
    });
  }


  removeProduct(cartId: number, cartDetailsId: number): void {
    this.cartService.removeProductFromCart(cartId, cartDetailsId).subscribe({
      next: (response) => {
        this.message = response;
        this.loadCartById(cartId);
      },
      error: (err) => {
        console.error('Error al eliminar el producto del carrito:', err);
      },
    });
  }
}
