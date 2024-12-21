import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/AccountService/account.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { catchError, Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../models/Dtos/userDto.model';
import { AddressDto } from '../../models/Dtos/AddressDto.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  currentUser$!: Observable<User | null>;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
    if (this.currentUser$ != null) {
      this.getCurrentUserInfo();
    }
  }

  getCurrentUserInfo(): void {
    this.accountService.getUserInfo();
  }

  deleteAddress(address: AddressDto): void {}

  logout(): void {
    this.authService.logout();
  }
}
