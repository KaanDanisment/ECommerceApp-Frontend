export interface ProductCreateDto {
  name: string;
  color: string;
  size: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  subcategoryId: number;
  images: FormData[];
}
