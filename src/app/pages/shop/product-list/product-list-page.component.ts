import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductResponse } from '../../../shared/models/product.model';

@Component({
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
})
export default class ProductListComponent implements OnInit {

  public productService = inject(ProductService);

  public cdr = inject(ChangeDetectorRef);

  private router = inject(Router);

  public products: ProductResponse[] = [];
  
  public message: string = '';


  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.cdr.detectChanges();
    });
  }

  goToProductDetails(productId: number) {
    this.router.navigate(['/shop/product', productId]);
  }

  addToCart(product: ProductResponse): void {
    // Mira si el producto ya existe en el carrito
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Si el carrito está vacío, lo inicializa
    const index = cart.findIndex((item: any) => item.id === product.id);

    // Si el producto no está en el carrito, lo añade
    if (index === -1) {
      cart.push({ ...product, quantity: 1 });
      // Actualiza el carrito en el localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      this.message = 'Producto añadido al carrito';
      this.cdr.detectChanges();
    } else {
      this.message = 'Este producto ya está en el carrito';
      this.cdr.detectChanges();
    }
  }

  
}
