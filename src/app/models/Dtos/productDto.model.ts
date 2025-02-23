export interface ProductDto {
  id: number;
  name: string;
  color: string;
  size: string;
  description: string;
  price: number;
  stock: number;
  categoryName?: string;
  categoryId: number;
  subcategoryName?: string;
  subcategoryId: number;
  createdAt: Date;
  imageUrls: string[];
}
