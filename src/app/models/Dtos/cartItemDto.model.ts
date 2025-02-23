import { ProductDto } from './productDto.model';

export interface CartItemDto {
  id: string;
  quantity: number;
  productId: number;
  cartId: string;
  unitPrice: number;
  productDto: ProductDto;
  createdAt: Date;
  lastUpdatedAt: Date;
}
