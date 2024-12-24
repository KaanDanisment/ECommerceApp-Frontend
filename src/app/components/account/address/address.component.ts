import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AddressDto } from '../../../models/Dtos/addressDto.model';
import { AccountService } from '../../../services/AccountService/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent {
  addressForm!: FormGroup;
  address!: AddressDto;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createAddressForm();
  }
  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      addressLine: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  createAddress() {
    this.address = Object.assign({}, this.addressForm.value);
    console.log(this.address);
    this.accountService.createAddress(this.address).subscribe({
      next: () => {
        this.router.navigate(['/account']);
        this.toastr.success('Adres kaydedildi');
      },
      error: (err) => {
        console.error(err.message, err.error);
        this.toastr.error(`${err.message}`);
      },
    });
  }
}
