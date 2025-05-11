import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './orders-list-page.component.html',
  styleUrl: './orders-list-page.component.css'
})
export default class OrdersListComponent {

}
