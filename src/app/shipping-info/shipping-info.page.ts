import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingCartService } from '../services/booking-cart.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.page.html',
  styleUrls: ['./shipping-info.page.scss'],
})
export class ShippingInfoPage implements OnInit {


  orderForm: FormGroup;
  isCompany: boolean = false;
  bookingCart: any[] = [];
  cartSubscription!: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private bookingCartService: BookingCartService
  ) {
    this.orderForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      city: ['', Validators.required],
      deliveryMethod: ['selfPickup', Validators.required],
      addressType: ['individual', Validators.required],
      companyName: [''],
      buildingName_No: ['', Validators.required],
      streetName_No: ['', Validators.required],
      landMark: ['', Validators.required],
      deliveryTime: ['', Validators.required],
    });
  }

  ngOnInit() {
 // Subscribe to the cart data and update when it changes
 this.cartSubscription = this.bookingCartService.bookingCart$.subscribe(
  (cart) => {
     this.bookingCart = cart;
     console.log('Cart updated:', this.bookingCart);
  }
);  }

  onAddressTypeChange(event: any) {
    this.isCompany = event.detail.value === 'company';
    if (!this.isCompany) {
      this.orderForm.patchValue({ companyName: '' }); // Clear company name if switching to individual
    }
  }

  onSubmit() {
    if (this.orderForm.valid) {
      console.log(this.orderForm.value);
      // Handle form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }
}

