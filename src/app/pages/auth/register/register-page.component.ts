import { Component, inject } from '@angular/core';

import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import AuthService from '../../../core/services/auth.service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { Customer } from '../../../shared/models/customer.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, FooterComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export default class RegisterComponent {

  private fb = inject( FormsModule );

  private authService = inject( AuthService );

  private router = inject( Router );



  user: Customer = {
    name: '',
    password: '',
    surname: '',
    surname2: '',
    address: '',
    city: "",
    province: '',
    region: '',
    postalCode: '',
    email: '',
    phone: '',
    status: true
  };

  provinciasEspana = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
    'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
    'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León',
    'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense', 'Palencia',
    'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria',
    'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
  ];

  register() {
    this.authService.register(this.user).pipe(
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
}
