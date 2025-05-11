import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import AuthService from '../../../core/services/auth.service';

@Component({
  selector: 'shared-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // styleUrls en lugar de styleUrl
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  public navbarItems: Array<{ label: string, url?: string, icon: string, action?: () => void, subItems?: Array<{ label: string, url?: string, action?: () => void }> }> = [];
  public isProfileDropdownOpen: boolean = false;  // Controla el dropdown

  ngOnInit(): void {
    this.navbarItems = [
      { label: 'Inicio', url: '/home', icon: PrimeIcons.HOME },
      { label: 'Ilustraciones', url: '/shop/products', icon: PrimeIcons.PALETTE },
      { label: 'Sobre Nosotros', url: '/shop/about-us', icon: PrimeIcons.ENVELOPE },
    ];


    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        this.navbarItems.push({
          label: 'Administración',
          url: '/admin/product-list',
          icon: PrimeIcons.COG
        });
      }

      this.navbarItems.push({
        label: 'Mi Perfil',
        icon: PrimeIcons.USER_EDIT,
        url: '/account/profile',
        subItems: [
          { label: 'Mis pedidos', url: '/account/my-orders' },
          { label: 'Editar perfil', url: '/account/profile' },
          { label: 'Cerrar sesión', action: () => this.logout() }
        ]
      });

      this.navbarItems.push(
        { label: 'Cesta', url: '/account/my-cart', icon: PrimeIcons.CART_PLUS }
      );
    } else {
      this.navbarItems.push(
        { label: 'Login', url: '/auth/login', icon: PrimeIcons.USER }
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
