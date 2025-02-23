import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { IndexComponent } from './components/index/index.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { authGuard } from './guards/auth.guard';
import { AddressComponent } from './components/account/address/address.component';
import { UpdateUserComponent } from './components/account/update-user/update-user.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/admin/admin-layout/dashboard/dashboard.component';
import { AdminOrdersComponent } from './components/admin/admin-layout/admin-orders/admin-orders.component';
import { AdminCustomersComponent } from './components/admin/admin-layout/admin-customers/admin-customers.component';
import { AdminProductsComponent } from './components/admin/admin-layout/admin-products/admin-products.component';
import { CreateProductComponent } from './components/admin/admin-layout/admin-products/create-product/create-product.component';
import { AdminCategoriesComponent } from './components/admin/admin-layout/admin-categories/admin-categories.component';
import { CreateCategoryComponent } from './components/admin/admin-layout/admin-categories/create-category/create-category.component';
import { UpdateCategoriesComponent } from './components/admin/admin-layout/admin-categories/update-categories/update-categories.component';
import { UpdateProductComponent } from './components/admin/admin-layout/admin-products/update-product/update-product.component';
import { SingleProductComponent } from './components/products/single-product/single-product.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'collection', component: ProductsComponent },
  { path: 'product/single-product/:id', component: SingleProductComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'account',
    children: [
      { path: '', component: AccountComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'address', component: AddressComponent },
      { path: 'update-user', component: UpdateUserComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'login', component: AdminLoginComponent },
      {
        path: '',
        component: AdminLayoutComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'products', component: AdminProductsComponent },
          { path: 'products/create', component: CreateProductComponent },
          { path: 'products/update', component: UpdateProductComponent },
          { path: 'orders', component: AdminOrdersComponent },
          { path: 'customers', component: AdminCustomersComponent },
          { path: 'categories', component: AdminCategoriesComponent },
          { path: 'categories/create', component: CreateCategoryComponent },
          { path: 'categories/update', component: UpdateCategoriesComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route
];
