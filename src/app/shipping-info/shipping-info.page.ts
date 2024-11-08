import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingCartService } from '../services/booking-cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/http.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import Swiper from 'swiper';
import { LanguageService } from '../services/language.service';
import { IonInput } from '@ionic/angular';
declare var google: any;

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
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentLanguage: string | 'en' | undefined;
  okButtonText: string = 'OK';
  cancelButtonText: string = 'Cancel';
  selectedLocation: { lat: number; lng: number } | null = null;
  @ViewChild('cityInput', { static: false }) cityInput!: IonInput;

  constructor(
    private formBuilder: FormBuilder,
    private bookingCartService: BookingCartService,
    private authService: AuthService,
    private httpClient: HttpClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private languageService: LanguageService,
    private ngZone: NgZone,
  ) {
    this.orderForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', Validators.required],
      deliveryMethod: ['selfPickup', Validators.required],
      addressType: ['individual', Validators.required],
      companyName: [''],
      buildingName_No: ['', Validators.required],
      streetName_No: ['', Validators.required],
      landMark: ['', Validators.required],
      deliveryTime: ['10AM-12PM', Validators.required],
    });
    this.setButtonText();
  }

  async ngOnInit() {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.setButtonText()
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'crescent',
    });
    await loading.present();
    this.cartSubscription = this.bookingCartService.bookingCart$.subscribe(
      (cart) => {
        this.bookingCart = cart;
      }
    );

    this.authService.getUserDetails$().subscribe(async (userDetails) => {
      if (userDetails && userDetails.customerName) {
        this.orderForm.patchValue({
          customerName: userDetails.customerName || '',
          emailID: userDetails.customerEmail || '',
          phoneNo: userDetails.customerMobile || ''
        });
      } else {

      }
      await loading.dismiss(); // Dismiss the loader when data is loaded
    });
  }

  onAddressTypeChange(event: any) {
    this.isCompany = event.detail.value === 'company';
    if (!this.isCompany) {
      this.orderForm.patchValue({ companyName: '' });
    }
  }

  setButtonText() {
    if (this.currentLanguage === 'ar') {
      this.okButtonText = 'موافق'; // Arabic for OK
      this.cancelButtonText = 'إلغاء'; // Arabic for Cancel
    } else {
      this.okButtonText = 'OK';
      this.cancelButtonText = 'Cancel';
    }
  }
  async onSubmit() {
    if (this.orderForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Submitting your order...',
        spinner: 'crescent',
      });
      await loading.present(); // Show the loader

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
      formdata.append('shippingCharge', '0');
      formdata.append('addressType', this.orderForm.value.addressType);
      formdata.append('AddressTypeName', this.isCompany ? this.orderForm.value.companyName : '');
      formdata.append('buildingName_No', this.orderForm.value.buildingName_No);
      formdata.append('streetName_No', this.orderForm.value.streetName_No);
      formdata.append('landMark', this.orderForm.value.landMark);
      formdata.append('emailID', this.orderForm.value.emailID);
      formdata.append('phoneNo', '+974' + this.orderForm.value.phoneNo);
      formdata.append('city', this.orderForm.value.city);
      formdata.append('deliveryTime', this.orderForm.value.deliveryTime);
      formdata.append('paymentType', 'Self Payment');

      this.httpClient.post('ecom/booking', formdata).subscribe(
        async (response) => {
          await loading.dismiss(); // Dismiss the loader on response
          if (response.respondStatus === 'SUCCESS') { // Use '===' for strict comparison
            this.presentSuccessAlert(response.successMessages.bookNo);
            this.bookingCartService.clearCart();
          }
        },
        async (error) => {
          await loading.dismiss(); // Dismiss the loader on error
          console.error('Error submitting order:', error);
        }
      );
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
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
      message: 'Your order has been placed successfully. Your order ID is: ' + msg + ' Please wait for our confirmation call.',
      buttons: [
        {
          text: 'Go to Home',
          handler: () => {
            this.router.navigate(['/tabs/home']);
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
      position: 'top',
      color: 'light',
    });

    await toast.present();
  }
  ngAfterViewInit() {
    this.initAutocomplete();
  }

  async initAutocomplete() {
    const inputElement = await this.cityInput.getInputElement();
    const options = {
      componentRestrictions: { country: 'QA' }, // Restrict to Qatar
    };

    const autocomplete = new google.maps.places.Autocomplete(inputElement, options);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location) {
          this.orderForm.get('city')?.setValue(place.formatted_address);
        }
      });
    });
  }
}


