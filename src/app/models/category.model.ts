import { CategoryDto } from './Dtos/categoryDto.model';

export class Category {
  id: number;
  name: string;

  constructor(categoryDto: CategoryDto) {
    this.id = categoryDto.id;
    this.name = categoryDto.name;
  }
}
