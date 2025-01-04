import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserRegisterDto } from '../../../models/Dtos/userRegisterDto.model';
import { AuthService } from '../../../services/AuthService/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  user!: UserRegisterDto;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmedPassword: ['', Validators.required],
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.userRegister(this.user).subscribe({
        next: () => {
          this.toastr.success('Kayıt işlemi başarılı');
          this.router.navigate(['/account/login']);
        },
        error: (err) => {
          console.error(err.message, err.error);
          this.toastr.error(`${err.message}`);
        },
      });
    } else {
      this.toastr.error('Lütfen tüm " * " ile işaretlenmiş alanları doldurun');
    }
  }
}
