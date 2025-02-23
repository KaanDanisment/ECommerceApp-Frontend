import { ProductDto } from './Dtos/productDto.model';

export class Product {
  id: number;
  name: string;
  color: string;
  size: string;
  description: string;
  price: string;
  stock: number;
  categoryName?: string;
  categoryId: number;
  subcategoryName?: string;
  subcategoryId: number;
  createdAt: string;
  imageUrls: string[];

  constructor(productDto: ProductDto) {
    this.id = productDto.id;
    this.name = productDto.name;
    this.color = productDto.color;
    this.size = productDto.size;
    this.description = productDto.description;
    this.price = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(productDto.price);
    this.stock = productDto.stock;
    this.categoryName = productDto.categoryName;
    this.categoryId = productDto.categoryId;
    this.subcategoryName = productDto.subcategoryName;
    this.subcategoryId = productDto.subcategoryId;
    // Tarihi formatla
    this.createdAt = new Date(productDto.createdAt).toLocaleDateString(
      'tr-TR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
    this.imageUrls = productDto.imageUrls;
  }
}
