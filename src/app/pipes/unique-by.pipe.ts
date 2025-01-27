import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueBy',
  standalone: true,
})
export class UniqueByPipe implements PipeTransform {
  transform(items: any[], key: string): any[] {
    if (!items || !key) {
      return items;
    }

    // Benzersiz değerleri filtreleme
    return items.filter(
      (item, index, self) =>
        self.findIndex((i) => i[key] === item[key]) === index
    );
  }
}
