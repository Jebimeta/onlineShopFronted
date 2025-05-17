import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export default class CartComponent {

  private router = inject(Router);

  public cart: any[] = [];

  public cartId: string = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    // Si no existe un cartId en localStorage, lo crea con uuid
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      cartId = uuidv4();
      localStorage.setItem('cartId', cartId);
    }
    this.cartId = cartId;

    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  removeProduct(productId: number): void {
  // Obtiene el carrito actual del localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  // Filtra el producto a eliminar
  const updatedCart = cart.filter((item: any) => item.id !== productId);
  // Actualiza el localStorage
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  // Actualiza la variable cart del componente
  this.cart = updatedCart;
}

calculateSubtotal(): number {
  return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}


  goToProduct(): void {
    this.router.navigate(['/shop']);
  }

  
}