import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { IndexComponent } from './components/index/index.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { authGuard } from './guards/auth.guard';
import { AddressComponent } from './components/account/address/address.component';
import { UpdateUserComponent } from './components/account/update-user/update-user.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'product', component: ProductsComponent },
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
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route
];
