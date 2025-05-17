import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import AuthService from '../../../core/services/auth.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { catchError, of, tap } from 'rxjs';
import { Customer } from '../../../shared/models/customer.model';

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export default class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    surname2: ['', [Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    province: ['', [Validators.required]],
    region: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]]
  }, {
    validators: this.passwordMatchValidator
  });

  // Datos de comunidades autónomas y provincias
regionesEspana = [
  { nombre: 'Andalucía', provincias: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'] },
  { nombre: 'Aragón', provincias: ['Huesca', 'Teruel', 'Zaragoza'] },
  { nombre: 'Asturias', provincias: ['Asturias'] },
  { nombre: 'Baleares', provincias: ['Islas Baleares'] },
  { nombre: 'Canarias', provincias: ['Las Palmas', 'Santa Cruz de Tenerife'] },
  { nombre: 'Cantabria', provincias: ['Cantabria'] },
  { nombre: 'Castilla-La Mancha', provincias: ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'] },
  { nombre: 'Castilla y León', provincias: ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'] },
  { nombre: 'Cataluña', provincias: ['Barcelona', 'Gerona', 'Lérida', 'Tarragona'] },
  { nombre: 'Comunidad Valenciana', provincias: ['Alicante', 'Castellón', 'Valencia'] },
  { nombre: 'Extremadura', provincias: ['Badajoz', 'Cáceres'] },
  { nombre: 'Galicia', provincias: ['La Coruña', 'Lugo', 'Orense', 'Pontevedra'] },
  { nombre: 'Madrid', provincias: ['Madrid'] },
  { nombre: 'Murcia', provincias: ['Murcia'] },
  { nombre: 'Navarra', provincias: ['Navarra'] },
  { nombre: 'País Vasco', provincias: ['Álava', 'Guipúzcoa', 'Vizcaya'] },
  { nombre: 'La Rioja', provincias: ['La Rioja'] },
  { nombre: 'Ceuta', provincias: ['Ceuta'] },
  { nombre: 'Melilla', provincias: ['Melilla'] }
];

provinciasFiltradas: string[] = [];

// Método para filtrar provincias según la región seleccionada
actualizarProvincias() {
  const regionSeleccionada = this.registerForm.get('region')?.value;
  const region = this.regionesEspana.find(r => r.nombre === regionSeleccionada);
  this.provinciasFiltradas = region ? region.provincias : [];
  this.registerForm.get('province')?.setValue(''); // Resetear provincia al cambiar región
}

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;
    const user: Customer = {
      name: formValue.name!,
      surname: formValue.surname!,
      surname2: formValue.surname2!,
      email: formValue.email!,
      password: formValue.password!,
      address: formValue.address!,
      city: formValue.city!,
      postalCode: formValue.postalCode!,
      province: formValue.province!,
      region: formValue.region! || '',
      phone: formValue.phone!,
      status: true
    };

    this.authService.register(user).pipe(
      tap(response => {
        console.log('Usuario registrado con éxito', response);
        this.router.navigateByUrl('/auth/user-registered');
      }),
      catchError(error => {
        console.error('Error en el registro', error);
        return of(null);
      })
    ).subscribe();
  }

  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }

  get f() {
    return this.registerForm.controls;
  }
}