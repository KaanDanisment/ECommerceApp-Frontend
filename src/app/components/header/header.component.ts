import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/SubcategoryService/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  subcategories$!: Observable<Subcategory[]>;
  isAuthenticated!: boolean;
  dropdownOpen = false;
  navbarOpen = false;
  accountDropdownOpen = false;

  constructor(
    private subcategoryService: SubcategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubcategories();
  }

  loadSubcategories(): void {
    this.subcategories$ = this.subcategoryService.getSubcategories().pipe(
      catchError((error) => {
        this.toastr.error(error.message);
        return throwError(() => error);
      })
    );
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
