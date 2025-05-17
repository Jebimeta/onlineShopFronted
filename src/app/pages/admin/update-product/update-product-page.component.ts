// Importación de módulos y servicios necesarios
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductResponse } from '../../../shared/models/product.model';

// Decorador del componente
@Component({
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent], // Módulos y componentes importados
  templateUrl: './update-product-page.component.html', // Ruta de la plantilla HTML
  styleUrl: './update-product-page.component.css' // Ruta del archivo CSS
})
export default class UpdateProductComponent {

  // Inyección de dependencias
  public productService = inject(ProductService); // Servicio para manejar productos
  public activatedRoute = inject(ActivatedRoute); // Para acceder a parámetros de ruta
  public router = inject(Router); // Para navegación
  public product?: ProductResponse; // Variable para almacenar el producto actual
  private cdr = inject(ChangeDetectorRef); // Para detección de cambios
  private fb = inject(FormBuilder); // Para construcción de formularios reactivos

  // Variables del formulario
  public productForm!: FormGroup; // Formulario reactivo
  public imagePreview: string | ArrayBuffer | File | null = null; // Vista previa de la imagen

  selectedFile: File | null = null; // Archivo seleccionado para subir

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Inicialización del formulario con validaciones
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
      size: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', Validators.required],
    });

    // Suscripción a los parámetros de la ruta para obtener el ID del producto
    this.activatedRoute.params
      .pipe(
        // Usamos switchMap para cambiar a la petición del producto
        switchMap(({ id }) => this.productService.getProductById(id)),
      )
      .subscribe({
        next: product => {
          // Si no hay producto, redirigimos
          if (!product) {
            this.router.navigateByUrl('/admin/product-list');
            return;
          }
          // Asignamos el producto y actualizamos el formulario
          this.product = product;
          this.setFormValues(product);
          this.cdr.detectChanges(); // Forzamos detección de cambios
        },
        error: err => {
          // Manejo de errores
          console.error('Error fetching product:', err);
          this.router.navigateByUrl('/admin/product-list');
        }
      });
  }

  // Método para establecer valores iniciales del formulario
  setFormValues(product: ProductResponse): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      size: product.size,
      type: product.type,
      price: product.price,
    });

    // Si hay imagen, la mostramos como vista previa
    if (product.image) {
      this.imagePreview = product.image;
    }
  }

  // Método que se ejecuta cuando se selecciona un archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Guardamos el archivo seleccionado

      // Creamos una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Método para volver atrás
  goBack(): void {
    this.router.navigateByUrl('/admin/product-list');
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    // Validamos el formulario y que haya un archivo seleccionado
    if (this.productForm.invalid || !this.selectedFile) return;

    // Creamos un FormData para enviar los datos
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value ?? '');
    formData.append('description', this.productForm.get('description')?.value ?? '');
    formData.append('size', this.productForm.get('size')?.value ?? '');
    formData.append('type', this.productForm.get('type')?.value ?? '');
    formData.append('price', (this.productForm.get('price')?.value ?? 0).toString());
    formData.append('image', this.selectedFile);

    // Si hay un ID de producto, actualizamos
    if(this.product?.id){
      this.productService.updateProduct(formData, this.product.id).subscribe(product => {
      this.router.navigateByUrl('/admin/product-list'); // Redirigimos después de actualizar
      });
    }
  }
}