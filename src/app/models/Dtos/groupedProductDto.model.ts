import { ProductDto } from './productDto.model';

export interface GroupedProductDto {
  products: ProductDto[];
  name: string;
  color: string;
  imageUrls: string[];
  sizes: string[];
  description: string;
  price: number;
}
