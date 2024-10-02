import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingCartService } from '../services/booking-cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/http.service';  // Assuming you have this service for HTTP calls

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
    private bookingCartService: BookingCartService,
    private authService: AuthService,
    private httpClient: HttpClientService  // Injecting HttpClientService
  ) {
    this.orderForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.minLength(12)]], // Ensures minimum length of 12 digits
      city: ['', Validators.required],
      deliveryMethod: ['Doorstep Delivery', Validators.required],  // Defaulting to Doorstep Delivery
      addressType: ['individual', Validators.required],
      companyName: [''],
      buildingName_No: ['', Validators.required],
      streetName_No: ['', Validators.required],
      landMark: ['', Validators.required],
      deliveryTime: ['10AM-12PM', Validators.required], // Defaulting delivery time for simplicity
    });
  }

  ngOnInit() {
    // Subscribe to the cart data and update when it changes
    this.cartSubscription = this.bookingCartService.bookingCart$.subscribe(
      (cart) => {
        this.bookingCart = cart;
        console.log('Cart updated:', this.bookingCart);
      });

    // Autofill user details if logged in
    this.authService.getUserDetails$().subscribe((userDetails) => {
      console.log(userDetails);
      if (userDetails) {
        this.orderForm.patchValue({
          customerName: userDetails.customerName || '',
          emailID: userDetails.customerEmail || '',
          phoneNo: userDetails.customerMobile || ''
        });
      }
    });
  }

  // Toggle company name field based on address type
  onAddressTypeChange(event: any) {
    this.isCompany = event.detail.value === 'company';
    if (!this.isCompany) {
      this.orderForm.patchValue({ companyName: '' }); // Clear company name if switching to individual
    }
  }

  
  onSubmit() {
    if (this.orderForm.valid) {
      const formdata = new FormData();
  
      // Append booking cart items to formData without nesting
      this.bookingCart.map((cartItem) => {
        formdata.append(`productID`, cartItem.product.productID);
        formdata.append(`atributeID`, cartItem.atributeID || '');
        formdata.append(`atributeItemID`, cartItem.atributeItemID || '');
        formdata.append(`quantity`, cartItem.quantity.toString());
        formdata.append(`slaughterCharge`, cartItem.slaughterCharge || '0.00');
        formdata.append(`cuttingAmount`, cartItem.cuttingAmount || '0');
        formdata.append(`orderTotal`, cartItem.orderTotal || '0');
        formdata.append(`payableAmount`, cartItem.payableAmount || '0');
      });
  
      // Append user form fields to formdata
      formdata.append('customerName', this.orderForm.value.customerName);
      formdata.append('deliveryMethod', this.orderForm.value.deliveryMethod);
      formdata.append('shippingCharge', '20');  // Assuming static
      formdata.append('addressType', this.orderForm.value.addressType);
      formdata.append('AddressTypeName', this.isCompany ? this.orderForm.value.companyName : '');
      formdata.append('buildingName_No', this.orderForm.value.buildingName_No);
      formdata.append('streetName_No', this.orderForm.value.streetName_No);
      formdata.append('landMark', this.orderForm.value.landMark);
      formdata.append('emailID', this.orderForm.value.emailID);
      formdata.append('phoneNo', this.orderForm.value.phoneNo);
      formdata.append('city', this.orderForm.value.city);
      formdata.append('deliveryTime', this.orderForm.value.deliveryTime);
      formdata.append('paymentType', 'Self Payment');  // Assuming static for now
  
      // Submit the formData via your service
      this.httpClient.post('ecom/booking', formdata).subscribe(
              (response) => {
                console.log('Order submitted successfully:', response);
              },
              (error) => {
                console.error('Error submitting order:', error);
              }
            );      
    } else {
      this.orderForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
  
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
