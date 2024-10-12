import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingCartService } from '../services/booking-cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/http.service';  // Assuming you have this service for HTTP calls
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
  isArabic = true;

  

  constructor(
    private formBuilder: FormBuilder,
    private bookingCartService: BookingCartService,
    private authService: AuthService,
    private httpClient: HttpClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
  ) {
    this.orderForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.minLength(8)]], // Ensures minimum length of 12 digits
      city: ['', Validators.required],
      deliveryMethod: ['selfPickup', Validators.required],  // Defaulting to Doorstep Delivery
      addressType: ['individual', Validators.required],
      companyName: [''],
      buildingName_No: ['', Validators.required],
      streetName_No: ['', Validators.required],
      landMark: ['', Validators.required],
      deliveryTime: ['10AM-12PM', Validators.required], // Defaulting delivery time for simplicity
    });
  }

  ngOnInit() {
    this.cartSubscription = this.bookingCartService.bookingCart$.subscribe(
      (cart) => {
        this.bookingCart = cart;
        console.log('Cart updated:', this.bookingCart);
      });

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

  onAddressTypeChange(event: any) {
    this.isCompany = event.detail.value === 'company';
    if (!this.isCompany) {
      this.orderForm.patchValue({ companyName: '' }); 
    }
  }

  
  onSubmit() {
    if (this.orderForm.valid) {
      const formdata = new FormData();
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
      formdata.append('customerName', this.orderForm.value.customerName);
      formdata.append('deliveryMethod', this.orderForm.value.deliveryMethod);
      formdata.append('shippingCharge', '0');  // Assuming static
      formdata.append('addressType', this.orderForm.value.addressType);
      formdata.append('AddressTypeName', this.isCompany ? this.orderForm.value.companyName : '');
      formdata.append('buildingName_No', this.orderForm.value.buildingName_No);
      formdata.append('streetName_No', this.orderForm.value.streetName_No);
      formdata.append('landMark', this.orderForm.value.landMark);
      formdata.append('emailID', this.orderForm.value.emailID);
      formdata.append('phoneNo', '+974' + this.orderForm.value.phoneNo);
      formdata.append('city', this.orderForm.value.city);
      formdata.append('deliveryTime', this.orderForm.value.deliveryTime);
      formdata.append('paymentType', 'Self Payment');  // Assuming static for now
  
      this.httpClient.post('ecom/booking', formdata).subscribe(
        (response) => {
              if(response.respondStatus = 'SUCCESS')
                console.log('Order submitted successfully:', response);
                this.presentSuccessAlert(response.successMessages.bookNo);
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

  onBack() {
    this.navCtrl.back();
  }

  async presentSuccessAlert(msg:string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your order has been placed successfully. Your order ID is: ' + msg + ' Please wait for our confirmation call.',
      buttons: [
        {
          text: 'Go to Home',
          handler: () => {
            this.router.navigate(['/tabs/home']); // Navigate to the home page
          }
        }
      ]
    });
    await alert.present();
  }

  

  async showDeliveryToast() {
    const toast = await this.toastController.create({
      message: 'Any order before 3 PM will be delivery on that day itself.Any order after 3PM will be delivery the next day.Estimated delivery time: 3-5 business days.',
      duration: 5000,
      position: 'top', // You can change this to 'top' or 'middle'
      color: 'light', // Customize the toast color if needed
    });

    await toast.present();
  }
}
