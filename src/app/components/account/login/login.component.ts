import { Component, model } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserLoginDto } from '../../../models/Dtos/userLoginDto.model';
import { AuthService } from '../../../services/AuthService/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  user!: UserLoginDto;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createLoginForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.user = Object.assign({}, this.loginForm.value);
    this.authService.userLogin(this.user).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
        this.toastr.success('Giriş yapıldı');
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
      },
    });
  }
}
