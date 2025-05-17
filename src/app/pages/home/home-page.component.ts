import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import SendEmailComponent from "./components/send-email/send-email.component";
import CarrouselComponent from "./components/carrousel/carrousel.component";
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    SendEmailComponent,
    CarrouselComponent,
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {

  public title = "PUNTILLISMO SHOP"

}
