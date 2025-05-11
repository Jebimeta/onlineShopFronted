import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { ProductResponse } from '../../../shared/models/product.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export default class ProductListComponent implements OnInit {

  public productService = inject( ProductService );
  public cdr = inject( ChangeDetectorRef );
  public products: ProductResponse[] = [];

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(
        products => {
          this.products = products;
          this.cdr.detectChanges();
        }
      );

  }




}
