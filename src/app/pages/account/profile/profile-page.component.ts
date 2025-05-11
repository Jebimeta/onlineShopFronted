import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service'; // Importa el servicio
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../../shared/models/customer.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export default class ProfileComponent implements OnInit { // Implementa OnInit

  public router = inject(Router);
  private accountService = inject(AccountService);
  private changeDetector = inject(ChangeDetectorRef);

  public customer: Customer = {
    name: '',
    password: '',
    surname: '',
    surname2: '',
    address: '',
    city: '',
    province: '',
    region: '',
    postalCode: '',
    email: '',
    phone: '',
    status: false,
  };

  public newEmail: string = '';
  public newPassword: string = '';
  public confirmNewPassword: string = '';
  public newAddress: string = '';
  public newProvince: string = '';
  public newRegion: string = '';
  public newPhone: string = '';

  ngOnInit(): void {
    this.loadUserData();
  }

  goToOrders(): void {
    this.router.navigateByUrl('/account/my-orders');
  }

  goToCart(): void {
    this.router.navigateByUrl('/account/my-cart');
  }

  loadUserData() {
    this.accountService.getAuthenticatedUser().subscribe({
      next: (user: Customer) => {
        this.customer = user;
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario', err);
      },
      complete: () => {
        console.log('Datos del usuario cargados correctamente');
      }
    });
  }

  updateEmail(): void {
    if (this.newEmail) {
      const updatedUser: Partial<Customer> = { email: this.newEmail };

      this.accountService.updateUser({ ...this.customer, ...updatedUser }).subscribe({
        next: (response) => {
          console.log('Correo actualizado con éxito', response);
          this.customer.email = this.newEmail;
          this.newEmail = '';
        },
        error: (err) => {
          console.error('Error al actualizar el correo', err);
        },
        complete: () => {
          console.log('Proceso de actualización de correo completado');
        }
      });
    }
  }

  updatePassword(): void {
    if (this.newPassword === this.confirmNewPassword) {
      const updatedUser: Partial<Customer> = { password: this.newPassword };

      this.accountService.updateUser({ ...this.customer, ...updatedUser }).subscribe({
        next: (response) => {
          console.log('Contraseña actualizada con éxito', response);
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña', err);
        },
        complete: () => {
          console.log('Proceso de actualización de contraseña completado');
        }
      });
    } else {
      console.error('Las contraseñas no coinciden');
    }
  }

  updateAddress(): void {
    const updatedUser: Partial<Customer> = {
      address: this.newAddress || this.customer.address,
      province: this.newProvince || this.customer.province,
      region: this.newRegion || this.customer.region,
      phone: this.newPhone || this.customer.phone
    };

    this.accountService.updateUser({ ...this.customer, ...updatedUser }).subscribe({
      next: (response) => {
        console.log('Dirección actualizada con éxito', response);
        this.customer.address = updatedUser.address || this.customer.address;
        this.customer.province = updatedUser.province || this.customer.province;
        this.customer.region = updatedUser.region || this.customer.region;
        this.customer.phone = updatedUser.phone || this.customer.phone;

        this.newAddress = '';
        this.newProvince = '';
        this.newRegion = '';
        this.newPhone = '';
      },
      error: (err) => {
        console.error('Error al actualizar la dirección', err);
      },
      complete: () => {
        console.log('Proceso de actualización de dirección completado');
      }
    });
  }
}
