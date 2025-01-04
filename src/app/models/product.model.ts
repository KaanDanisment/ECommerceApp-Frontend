import { ProductDto } from './Dtos/productDto.model';

export class Product {
  id: number;
  name: string;
  color: string;
  size: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  createdAt: string;
  subcategoryId: number;
  imageUrls: string[];

  constructor(productDto: ProductDto) {
    this.id = productDto.id;
    this.name = productDto.name;
    this.color = productDto.color;
    this.size = productDto.size;
    this.description = productDto.description;
    this.price = productDto.price;
    this.stock = productDto.stock;
    this.categoryId = productDto.categoryId;
    // Tarihi formatla
    this.createdAt = new Date(productDto.createdAt).toLocaleDateString(
      'tr-TR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
    this.subcategoryId = productDto.subcategoryId;
    this.imageUrls = productDto.imageUrls;
  }
}
