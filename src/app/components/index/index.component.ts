import { Component } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { LastProductsComponent } from './last-products/last-products.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [SliderComponent, LastProductsComponent, ContactComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {}
