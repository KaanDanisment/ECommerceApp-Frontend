import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, take, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/AuthService/auth.service';
import { AccountService } from '../../services/AccountService/account.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  subcategories$!: Observable<Subcategory[]>;
  isAuthenticated$!: Observable<boolean>;
  dropdownOpen = false;
  navbarOpen = false;
  accountDropdownOpen = false;

  constructor(
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSubcategories();
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  loadSubcategories(): void {
    this.subcategories$ = this.subcategoryService.getSubcategories().pipe(
      catchError((error) => {
        this.toastr.error(error.message);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
