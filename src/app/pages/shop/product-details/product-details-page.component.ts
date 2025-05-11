import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductResponse } from '../../../shared/models/product.model';

@Component({
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.css'
})
export default class ProductDetailsComponent {

  public productService = inject( ProductService );
  public activatedRoute = inject( ActivatedRoute );
  public router = inject( Router );
  public product?: ProductResponse;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.productService.getProductById(id) ),
      )
      .subscribe({
        next: product => {
          if (!product) {
            this.router.navigateByUrl('/shop/products');
            return;
          }
          this.product = product;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error fetching product:', err);
          this.router.navigateByUrl('/shop/products');
        }
      });
  }

  goBack():void{
    this.router.navigateByUrl('/shop/products');
  }

}
