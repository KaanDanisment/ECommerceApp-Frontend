import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/ProductService/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GroupedProductDto } from '../../../models/Dtos/groupedProductDto.model';

@Component({
  selector: 'app-last-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './last-products.component.html',
  styleUrl: './last-products.component.css',
})
export class LastProductsComponent {
  latestProducts$!: Observable<GroupedProductDto[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadLatestProducts();
  }

  loadLatestProducts(): void {
    this.latestProducts$ = this.productService.getLatestProducts();
  }
}
