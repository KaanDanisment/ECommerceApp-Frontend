import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import 'zone.js';
import { map, Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../../services/SubcategoryService/subcategory.service';
import { SubcategoryDto } from '../../../models/Dtos/subcategoryDto.model';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CarouselModule, CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent {
  subcategories$!: Observable<SubcategoryDto[] | null>;

  constructor(private subcategoryService: SubcategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.subcategories$ = this.subcategoryService
      .getSubcategories(false)
      .pipe(
        map((subcategories) => subcategories?.filter((sub) => sub.imageUrl))
      );
  }
  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000, // Slaytlar arasında 3 saniye bekle
    autoplaySpeed: 1000, // Geçiş hızını 1 saniye yap
    autoplayHoverPause: true,
    autoHeight: false,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };
}
