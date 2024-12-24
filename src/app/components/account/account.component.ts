import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/AccountService/account.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { AddressDto } from '../../models/Dtos/addressDto.model';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

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
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo(): void {
    this.accountService.getUserInfo();
  }

  deleteAddress(address: AddressDto): void {
    this.accountService.deleteAddress(address).subscribe({
      next: () => {
        this.toastr.success('Adres başarıyla silindi');
        this.getCurrentUserInfo();
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
