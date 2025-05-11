import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, NavbarComponent, RouterModule, FooterComponent,
  ],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutUsPage { }
