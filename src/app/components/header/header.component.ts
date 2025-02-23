import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';
import { RouterModule } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../services/AuthService/auth.service';
import { CategoryService } from '../../services/CategoryService/category.service';
import { Category } from '../../models/category.model';

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
  categories$!: Observable<Category[] | null>;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSubcategories();
    this.loadCategories();
    this.authService.isAuthenticated().subscribe({
      next: () => {
        this.isAuthenticated$ = this.authService.isAuthenticated$;
      },
    });
  }

  loadCategories(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  loadSubcategories(): void {
    this.subcategoryService.getSubcategories(false).subscribe({
      next: () => {
        this.subcategories$ = this.subcategoryService.subcategories$;
      },
    });
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
