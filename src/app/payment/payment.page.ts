import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/http.service';  // Assuming you have this service for HTTP calls
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { DatePipe } from '@angular/common';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {


  orderForm: FormGroup;
  isCompany: boolean = false;
  bookingCart: any[] = [];
  cartSubscription!: Subscription;
  isArabic = true;
  cartItems: CartItem[] = [];
  totalAmount = 0;
  cartCount = this.cartService.cartItemCount$ || 0;
  count: any = 0;
  formattedDate: string;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private httpClient: HttpClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
    private cartService: CartService,
    private datePipe: DatePipe
  ) {
    const now = new Date();
    this.formattedDate = this.datePipe.transform(now, 'dd-MM-yyyy EEE') as string;

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
      deliveryTime: ['10AM-12PM', Validators.required],
      zoneNo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });
    console.log('Cart updated:', this.cartItems);
    this.cartCount.subscribe((count: any) => {
      this.count = count;
    });
    this.totalAmount = this.cartItems.reduce((sum: number, item) => {
      return sum + Number(item.totalPrice) + Number(item.slaughterCharge) * Number(item.quantity); // Convert to number
    }, 0);

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

  //  ngOnInit() {
  //   let formData = new FormData();

  //   let products = [
  //     {
  //       productID: 39,
  //       productPrice: 650.00,
  //       SlaughterCharge: 30.00,
  //       packingCharge: undefined,
  //       productQuantity: 1,
  //       productAmount: 680,
  //       productAttributes: [
  //         {
  //           atributeID: "491",
  //           en_atributeName: "Cutting Type",
  //           ar_atributeName: "Cutting Type",
  //           items: {
  //             atributeItemID: "2898",
  //             en_itemName: "Full",
  //             ar_itemName: "Full",
  //             extraCost: "0.00"
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       productID: 101,
  //       productPrice: 750.00,
  //       SlaughterCharge: 30.00,
  //       packingCharge: undefined,
  //       productQuantity: 3,
  //       productAmount: 2340,
  //       productAttributes: [
  //         {
  //           atributeID: "493",
  //           en_atributeName: "Cutting Type",
  //           ar_atributeName: "Cutting Type",
  //           items: {
  //             atributeItemID: "2909",
  //             en_itemName: "2 Pcs",
  //             ar_itemName: "2 Pcs",
  //             extraCost: "0.00"
  //           }
  //         }
  //       ]
  //     }
  //   ];
  //   // Append products to FormData
  //   products.forEach((product, index) => {
  //     formData.append(`products[${index}][productID]`, product.productID.toString());
  //     formData.append(`products[${index}][productPrice]`, product.productPrice.toString());
  //     formData.append(`products[${index}][SlaughterCharge]`, product.SlaughterCharge.toString());

  //     // Handle undefined packingCharge
  //     formData.append(`products[${index}][packingCharge]`, product.packingCharge ? product.packingCharge : '0');   

  //     formData.append(`products[${index}][productQuantity]`, product.productQuantity.toString());
  //     formData.append(`products[${index}][productAmount]`, product.productAmount.toString());

  //     // Stringify the productAttributes array and append as a single JSON string
  //     formData.append(`products[${index}][productAttributes]`, JSON.stringify(product.productAttributes));
  //   });

  //   // Append other data
  //   formData.append("totalProductsQuantity", "4");
  //   formData.append("totalProductPrice", "3020");
  //   formData.append("shippingCharge", "0");
  //   formData.append("shippingDiscount", "0");
  //   formData.append("couponDiscount", "0");
  //   formData.append("otherDiscount", "0");
  //   formData.append("grantTotal", "3020");
  //   formData.append("paymentType", "Online");
  //   formData.append("DeliveryMethod", "Self Pickup");
  //   formData.append("DeliveryDate", "05-10-2024 Sat");
  //   formData.append("DeliveryTime", "10AM-12PM");
  //   formData.append("paymentMethod", "card");
  //   formData.append("addressType", "Individual");
  //   formData.append("AddressTypeName", "333");
  //   formData.append("name", "ali");
  //   formData.append("buildingName_No", "333");
  //   formData.append("zoneNo", "333");
  //   formData.append("streetName_No", "33");
  //   formData.append("landMark", "33");
  //   formData.append("emailID", "SHEIKHUSMAN545@GMAIL.COM");
  //   formData.append("mobileNumber", "33272357");
  //   formData.append("city", "33");
  //   // this.httpClient.post('ecom/cart', formData).subscribe(async response => {
  //   //   console.log('Order submitted successfully', response);
  //   //   let link = response.successMessages.redirectionURL;
  //   //   console.log('Redirecting to:', link);
  //   //    await Browser.open({ url: link });


  //   // }, error => {
  //   //   console.error('Error submitting order', error);
  //   // });
  //  }
  onSubmit() {
    if (this.orderForm.valid) {
      let formData = new FormData();

      this.cartItems.forEach((product, index) => {
        formData.append(`products[${index}][productID]`, product.product.productID.toString());
        formData.append(`products[${index}][productPrice]`, product.product.productPrice.toString());
        formData.append(`products[${index}][SlaughterCharge]`, product.product.SlaughterCharge.toString());

        // Handle undefined packingCharge
        formData.append(`products[${index}][packingCharge]`, product.product.packingCharge ? product.product.packingCharge : '0');

        formData.append(`products[${index}][productQuantity]`, product.quantity.toString());
        let amount = 0;
        amount = 
        Number(product.totalPrice) + 
        Number(product.slaughterCharge) * 
        Number(product.quantity);
      
      formData.append(`products[${index}][productAmount]`, amount.toFixed(2).toString());  
        // Stringify the productAttributes array and append as a single JSON string
        formData.append(`products[${index}][productAttributes]`, JSON.stringify(product.productAttributes));
      });


      formData.append("totalProductsQuantity", this.count);
      formData.append("totalProductPrice", this.totalAmount.toString());
      formData.append("shippingCharge", "0");
      formData.append("shippingDiscount", "0");
      formData.append("couponDiscount", "0");
      formData.append("otherDiscount", "0");
      formData.append("grantTotal", this.totalAmount.toString());
      formData.append("paymentType", "Online");
      formData.append("DeliveryMethod", this.orderForm.value.deliveryMethod);
      formData.append("DeliveryDate", this.formattedDate);
      formData.append("DeliveryTime", this.orderForm.value.deliveryTime);
      formData.append("paymentMethod", "card");
      formData.append("addressType", this.orderForm.value.addressType);
      formData.append("AddressTypeName", this.isCompany ? this.orderForm.value.companyName : '');
      formData.append("name", this.orderForm.value.customerName);
      formData.append("buildingName_No", this.orderForm.value.buildingName_No);
      formData.append("zoneNo", this.orderForm.value.zoneNo);
      formData.append("streetName_No", this.orderForm.value.streetName_No);
      formData.append("landMark", this.orderForm.value.landMark);
      formData.append("emailID", this.orderForm.value.emailID);
      formData.append("mobileNumber", this.orderForm.value.phoneNo);
      formData.append("city", this.orderForm.value.city);
      this.httpClient.post('ecom/cart', formData).subscribe(async response => {
        console.log('Order submitted successfully', response);
        if (response.respondStatus = 'SUCCESS') {
          let link = response.successMessages.redirectionURL;
          console.log('Redirecting to:', link);
          this.cartService.clearCart();
          await Browser.open({ url: link });
          this.cartService.clearCart();
          this.presentSuccessAlert("You are redirecting to payment gateway Please Make Payment");
          this.router.navigate(['/tabs/home']);
        } else {
          console.error('Error submitting order', response);
         }

      


      }, error => {
        console.error('Error submitting order', error);
      });
      // formdata.append('customerName', this.orderForm.value.customerName);
      // formdata.append('deliveryMethod', this.orderForm.value.deliveryMethod);
      // formdata.append('shippingCharge', '0');  // Assuming static
      // formdata.append('addressType', this.orderForm.value.addressType);
      // formdata.append('AddressTypeName', this.isCompany ? this.orderForm.value.companyName : '');
      // formdata.append('buildingName_No', this.orderForm.value.buildingName_No);
      // formdata.append('streetName_No', this.orderForm.value.streetName_No);
      // formdata.append('landMark', this.orderForm.value.landMark);
      // formdata.append('emailID', this.orderForm.value.emailID);
      // formdata.append('phoneNo', '+974' + this.orderForm.value.phoneNo);
      // formdata.append('city', this.orderForm.value.city);
      // formdata.append('deliveryTime', this.orderForm.value.deliveryTime);
      // formdata.append('paymentType', 'Self Payment');
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

  async presentSuccessAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: msg,
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

  goToCheckout() {
    console.log('Navigating to checkout page');
    this.router.navigate(['/tabs/cart']);
  }
}



