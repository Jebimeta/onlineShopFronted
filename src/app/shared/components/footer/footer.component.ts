import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import AuthService from '../../../core/services/auth.service';

@Component({
  selector: 'shared-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FooterComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  public footerItems: Array<{ label: string, url?: string, action?: () => void, subItems?: Array<{ label: string, url?: string, action?: () => void }> }> = [];


  public correo = "onlineshop@gmail.com";
  public telefono = "+34 123 456 789";
  public instagram = "https://www.instagram.com/onlineshop/";
  public twitter = "https://www.twitter.com/onlineshop/";
  public facebook = "https://www.facebook.com/onlineshop/";


  ngOnInit(): void {
    this.footerItems = [
      { label: this.correo, url: '/home' },
      { label: this.telefono, url: '/shop/products' },
    ]};




}
