import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Product } from '../../../shared/models/product.model';


@Component({
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './create-product-page.component.html',
  styleUrl: './create-product-page.component.css'
})
export default class CreateProductComponent implements OnInit{
  private productService = inject( ProductService );
  private cdr = inject( ChangeDetectorRef );
  private activatedRoute = inject( ActivatedRoute );
  private router = inject(Router);
  private baseUrl: string = environments.baseProductsURL;

  public productForm = new FormGroup({
    name:        new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
    size:        new FormControl<string>('', { nonNullable: true }),
    type:        new FormControl<string>('', { nonNullable: true }),
    price:       new FormControl<number | null>(null, { nonNullable: true }),
    image:       new FormControl<File | null>(null, { nonNullable: true }),
  });

  get currentProduct(): Product {
    const product = this.productForm.value as Product;
    return product;
  }

  ngOnInit(): void {

    if( !this.router.url.includes('update') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.productService.getProductById( id ) ),
      ).subscribe( product => {
        if ( !product ) {
            return this.router.navigateByUrl('/');
        }
        this.productForm.reset( product );
        return product;
      });
  }

  selectedFile: File | null = null;


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit():void {
    if (this.productForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value ?? '');
    formData.append('description', this.productForm.get('description')?.value ?? '');
    formData.append('size', this.productForm.get('size')?.value ?? '');
    formData.append('type', this.productForm.get('type')?.value ?? '');
    formData.append('price', (this.productForm.get('price')?.value ?? 0).toString());
    formData.append('image', this.selectedFile);

    this.productService.createProduct(formData).subscribe(product => {
      this.router.navigateByUrl('/admin/product-list');
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/admin/product-list');
  }

}
