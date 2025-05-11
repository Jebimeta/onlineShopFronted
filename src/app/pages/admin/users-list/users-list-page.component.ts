import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CustomerResponse } from '../../../shared/models/customer.model';

@Component({
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './users-list-page.component.html',
  styleUrls: ['./users-list-page.component.css']
})
export default class UsersListComponent implements OnInit {

  customers: CustomerResponse[] = [];
  paginatedCustomers: CustomerResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  private userService = inject(UserService);
  public cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.userService.getCustomers().subscribe(customers => {
        this.customers = customers.sort((a, b) => a.id - b.id);
        this.updatePaginatedCustomers();
        this.cdr.detectChanges();
      });
    });
  }

  updatePaginatedCustomers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.customers.slice(startIndex, endIndex);
    this.cdr.detectChanges(); // Asegurarse de que la vista se actualice
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.customers.length) {
      this.currentPage++;
      this.updatePaginatedCustomers();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge'
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCustomers();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge'
      });
    }
  }
}
