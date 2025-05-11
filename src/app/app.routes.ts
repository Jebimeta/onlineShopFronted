import { Routes } from '@angular/router';
import { canActivateGuard, canMatchGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home-page.component'),
  },
  {
    path: '404',
    loadComponent: () => import('./pages/error/error404-page.component')
  },
  {
    path: 'admin',
    canActivate: [canActivateGuard],
    canMatch: [canMatchGuard],
    loadComponent: () => import('./pages/admin/admin.component'),
    children: [
      {
        path: 'dashboard',
        title: "Dashboard de administrador",
        loadComponent: () => import('./pages/admin/dashboard/dashboard-page.component'),
      },
      {
        path: 'product-list',
        title: "Listado de productos",
        loadComponent: () => import('./pages/admin/admin-product-list/admin-product-list-page.component'),
      },
      {
        path: 'users-list',
        title: "Listado de usuarios",
        loadComponent: () => import('./pages/admin/users-list/users-list-page.component'),
      },
      {
        path: 'carts-list',
        title: "Listado de carritos",
        loadComponent: () => import('./pages/admin/carts-list/carts-list-page.component'),
      },
      {
        path:  'create-product',
        title: "Crear un producto",
        loadComponent: () => import('./pages/admin/create-product/create-product-page.component'),
      },
      {
        path:  'update-product/:id',
        title: "Actualizar un producto",
        loadComponent: () => import('./pages/admin/update-product/update-product-page.component'),
      },
      {
        path:  'orders-list',
        title: "Listado de pedidos",
        loadComponent: () => import('./pages/admin/orders-list/orders-list-page.component'),
      },
      {
        path:  'update-order/:id',
        title: "Actualizar estado de pedido",
        loadComponent: () => import('./pages/admin/update-order/update-order-page.component'),
      },
      {
        path:'', redirectTo: 'dashboard', pathMatch: 'full',
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component'),
    children: [
      {
        path: 'login',
        title: "Inicio de sesión",
        loadComponent: () => import('./pages/auth/login/login-page.component'),
      },
      {
        path: 'register',
        title: "Registro de usuario",
        loadComponent: () => import('./pages/auth/register/register-page.component'),
      },
      {
        path: 'user-registered',
        title: "Registro de usuario completado",
        loadComponent: () => import('./pages/auth/user-registered/user-registered-page.component'),
      },
      {
        path: 'verify/:token',
        title: "Verificación de usuario",
        loadComponent: () => import('./pages/auth/verify/verify-page.component'),
      },
      {
        path: 'verify-error',
        title: 'Error de verificación',
        loadComponent: () => import('./pages/auth/verify-error/verify-error-page.component'),
      },
      {
        path:'', redirectTo: 'login', pathMatch: 'full',
      }
    ]
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component'),
    children: [
      {
        path: 'products',
        title: "Lista de productos",
        loadComponent: () => import('./pages/shop/product-list/product-list-page.component'),
      },
      {
        path: 'product/:id',
        title: "Producto en detalle",
        loadComponent: () => import('./pages/shop/product-details/product-details-page.component'),
      },
      {
        path: 'about-us',
        title: "Sobre nosotros",
        loadComponent: () => import('./pages/shop/about-us/about-us-page.component'),
      },
      {
        path:'', redirectTo: 'products', pathMatch: 'full',
      }
    ]
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component'),
    children: [
      {
        path: 'profile',
        title: "Perfil de usuario",
        canActivate: [canActivateGuard],
        canMatch: [canMatchGuard],
        loadComponent: () => import('./pages/account/profile/profile-page.component'),
      },
      {
        path: 'my-orders',
        title: "Todos los pedidos",
        canActivate: [canActivateGuard],
        canMatch: [canMatchGuard],
        loadComponent: () => import('./pages/account/orders/orders-page.component'),
      },
      {
        path: 'my-cart',
        title: "Carrito de compra",
        canActivate: [canActivateGuard],
        canMatch: [canMatchGuard],
        loadComponent: () => import('./pages/account/cart/cart-page.component'),
      },
      {
        path:'', redirectTo: 'account', pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }

];
