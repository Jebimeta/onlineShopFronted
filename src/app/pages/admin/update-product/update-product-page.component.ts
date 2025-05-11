import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductResponse } from '../../../shared/models/product.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './update-product-page.component.html',
  styleUrl: './update-product-page.component.css'
})
export default class UpdateProductComponent {

  public productService = inject(ProductService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);
  public product?: ProductResponse;
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  public productForm!: FormGroup;
  public imagePreview: string | ArrayBuffer | File | null = null;

  selectedFile: File | null = null;

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
      size: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', Validators.required],
    });

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.productService.getProductById(id)),
      )
      .subscribe({
        next: product => {
          if (!product) {
            this.router.navigateByUrl('/admin/product-list');
            return;
          }
          this.product = product;
          this.setFormValues(product);
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error fetching product:', err);
          this.router.navigateByUrl('/admin/product-list');
        }
      });
  }

  setFormValues(product: ProductResponse): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      size: product.size,
      type: product.type,
      price: product.price,
    });

    if (product.image) {
      this.imagePreview = product.image;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/admin/product-list');
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value ?? '');
    formData.append('description', this.productForm.get('description')?.value ?? '');
    formData.append('size', this.productForm.get('size')?.value ?? '');
    formData.append('type', this.productForm.get('type')?.value ?? '');
    formData.append('price', (this.productForm.get('price')?.value ?? 0).toString());
    formData.append('image', this.selectedFile);

    if(this.product?.id){
      this.productService.updateProduct(formData, this.product.id).subscribe(product => {
      this.router.navigateByUrl('/admin/product-list');
      });
    }

  }
}
