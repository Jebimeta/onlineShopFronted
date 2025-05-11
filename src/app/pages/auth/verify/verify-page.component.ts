import { Component, inject, OnInit } from '@angular/core';
import AuthService from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './verify-page.component.html',
  styleUrls: ['./verify-page.component.css']
})
export default class VerifyPageComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  verificationMessage: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log('Parámetros de la ruta:', params);
      const token = params.get('token');
      if (token) {
        this.verify(token);
      } else {
        this.verificationMessage = 'Token no encontrado en la URL.';
        console.error(this.verificationMessage);
      }
    });
  }

  verify(token: string) {
  this.authService.verify(token).pipe(
    tap(response => {
      console.log('Respuesta de verificación:', response.accessToken);
      if (response?.accessToken) {
        this.authService.saveToken(response.accessToken);
        this.authService.saveRefreshToken(response.refreshToken);
        console.log('Verificación exitosa, redirigiendo a /home');
        this.router.navigate(['/home']).then(navResult => {
          if (!navResult) {
            console.error('Redirección fallida a /home');
          }
        });
      } else {
        console.error('La respuesta no contiene accessToken', response);
        this.verificationMessage = 'La verificación falló: respuesta inesperada del servidor';
      }
    }),
    catchError((error) => {
      console.error('Error en verificación:', error);
      this.verificationMessage = error.error?.message || 'Ocurrió un error durante la verificación.';
      return of(null);
    })
  ).subscribe();
}


}
