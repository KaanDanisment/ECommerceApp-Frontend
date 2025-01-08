import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of, take, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/AuthService/auth.service';
import { AccountService } from '../../services/AccountService/account.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isAuthenticated$!: Observable<boolean | null>;
  dropdownOpen = false;
  navbarOpen = false;
  accountDropdownOpen = false;
  subcategories$!: Observable<Subcategory[] | null>;

  constructor(
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subcategories$ = this.subcategoryService.subcategories$;
    this.loadSubcategories();
    console.log('header');
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.authService.isAuthenticated().subscribe();
  }

  loadSubcategories(): void {
    this.subcategoryService.getSubcategories(false).subscribe();
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
