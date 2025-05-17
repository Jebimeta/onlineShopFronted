import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductResponse } from '../../../shared/models/product.model';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [
    CommonModule, NavbarComponent, CardModule, Button, PrimeTemplate, PanelModule, FieldsetModule,
  ],
  templateUrl: './admin-product-list-page.component.html',
  styleUrl: './admin-product-list-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminProductListComponent {

  public productService = inject(ProductService);

  public cdr = inject(ChangeDetectorRef);

  public products: ProductResponse[] = [];

  public router = inject(Router);


  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(
        products => {
          this.products = products;
          this.cdr.detectChanges();
        }
      );
  }

  updateProduct(id:number): void {
    this.router.navigateByUrl( 'admin/update-product/' + id );
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: (deleted: boolean) => {
        if (deleted) {
          this.products = this.products.filter(product => product.id !== id);
          this.cdr.detectChanges();
        } else {
          console.error('Product could not be deleted.');
        }
      },
      error: (error) => {
        console.error('Unexpected error', error);
      }
    });
  }

  create(): void {
    this.router.navigateByUrl('/admin/create-product');
  }

  getAllUsers(): void {
    this.router.navigateByUrl('admin/users-list')
  }

  getAllOrders(): void {
    this.router.navigateByUrl('admin/orders-list')
  }

  getAllCarts(): void {
    this.router.navigateByUrl('admin/carts-list')
  }
}
