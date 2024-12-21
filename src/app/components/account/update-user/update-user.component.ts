import { Component } from '@angular/core';
import { AccountService } from '../../../services/AccountService/account.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDto } from '../../../models/Dtos/userDto.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent {
  userUpdateForm!: FormGroup;
  currentUser$!: Observable<User | null>;
  user!: UserDto;
  userId!: string;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
    this.createRegisterForm();
    if (this.currentUser$ != null) {
      this.getCurrentUserInfo();
    }
  }

  getCurrentUserInfo(): void {
    this.accountService.getUserInfo();
  }

  createRegisterForm() {
    this.userUpdateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

    this.currentUser$.subscribe((data) => {
      if (data) {
        this.userId = data.id;
        this.userUpdateForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
      }
    });
  }

  updateUser(): void {
    this.user = Object.assign({}, this.userUpdateForm.value);
    this.user.id = this.userId;
    this.user.addresses = [];
    this.accountService.updateUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['/account']);
        this.toastr.success('Bilgiler güncellendi!');
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
      },
    });
  }
}
