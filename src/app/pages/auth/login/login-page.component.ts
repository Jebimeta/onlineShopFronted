import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import AuthService from '../../../core/services/auth.service';
import { Login } from '../../../shared/models/login.model';


@Component({
  standalone: true,
  imports: [NavbarComponent, FormsModule, FooterComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginComponent {

  private authService = inject( AuthService );
  public router = inject( Router );

  user: Login = {
    email: '',
    password: ''
  }

  login(){
    this.authService.login(this.user).pipe(
      tap(response => {
        console.log('Inicio de sesión exitoso', response);
        if (response && response.accessToken) {
          this.authService.saveToken(response.accessToken);
          this.authService.saveRefreshToken(response.refreshToken);
          console.log('Token message: ' + response.message);
          this.router.navigateByUrl('/home');
        }
      }),
      catchError(error => {
        console.error('Error en el inicio de sesión', error);
        return of(null);
      })
    ).subscribe();
  }

  goToRegister(): void {
    this.router.navigateByUrl('/auth/register');
  }

}
