import { Component, ElementRef, OnInit, ViewChild, NgZone, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingCartService } from '../services/booking-cart.service';
import { Subscription } from 'rxjs';
import { HttpClientService } from '../services/http.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import Swiper from 'swiper';
import { LanguageService } from '../services/language.service';
import { IonInput } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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
  routeSubscription!: Subscription;
  isArabic = true;
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentLanguage: string | 'en' | undefined;
  okButtonText: string = 'OK';
  cancelButtonText: string = 'Cancel';
  selectedLocation: { lat: number; lng: number } | null = null;
  @ViewChild('cityInput', { static: false }) cityInput!: IonInput;
  ID: any;
  grandTotal: any = 0;
  additionalCharge: number = 0;
  private subscriptions: Subscription = new Subscription();
  minDate: string;
  maxDate: string;


  constructor(
    private formBuilder: FormBuilder,
    private bookingCartService: BookingCartService,
    private httpClient: HttpClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private languageService: LanguageService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute

  ) {
    const today = new Date();
    this.minDate = today.toISOString(); // today
    const max = new Date(today);
    max.setDate(today.getDate() + 3);   // +3 days from today
    this.maxDate = max.toISOString();
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
      deliveryTime: ['10AM-01PM', Validators.required],
      saveAddress: [false],
      DeliveryDate: [today.toISOString()],
      pickupLocation: ['Alanaam-factory', Validators.required],
    });
    this.setButtonText();
  }

  async ngOnInit() {
    //this.currentLanguage = this.languageService.getCurrentLanguage();
    this.subscriptions.add(
      this.languageService.language$.subscribe((language) => {
        this.currentLanguage = language;
        console.log(`Language changed to: ${language}`);
      })
    );

    this.setButtonText()
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'crescent',
    });
    await loading.present();
    this.cartSubscription = this.bookingCartService.bookingCart$.subscribe(
      (cart) => {
        this.bookingCart = cart;
        if (this.bookingCart) {
          this.getTotal();
        }
      }
    );
    if (this.grandTotal === 0) {
      this.navCtrl.back();
    }


    this.routeSubscription = this.activatedRoute.url.subscribe(() => {
      setTimeout(() => {
        this.initAutocomplete();
      });
    });
    this.ifDoorStepDelivery();
    this.checkUserInfo();
    this.loadSavedAddress();
    await loading.dismiss(); // Dismiss the loader when data is loaded

  }
  getTotal(): void {

    this.grandTotal = this.bookingCart.reduce((total, item) => {
      const quantity = item.quantity || 0;
      const price = Number(item.price) || 0;
      const slaughterCharge = Number(item.slaughterCharge) || 0;
      const cuttingAmount = Number(item.cuttingAmount) || 0;

      return total + (quantity * (price + slaughterCharge + cuttingAmount));
    }, 0);
  }

  ifDoorStepDelivery() {
    this.orderForm.get('deliveryMethod')?.valueChanges.subscribe((method) => {
      if (method === 'Doorstep Delivery') {
        this.additionalCharge = 20;
      } else {
        this.additionalCharge = 0;
      }
    });
  }

  checkUserInfo() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails')!);
    if (userDetails) {
      this.ID = userDetails.customerID || '';

      this.orderForm.patchValue({
        customerName: userDetails.customerName || '',
        emailID: userDetails.customerEmail || '',
        phoneNo: userDetails.customerMobile || ''
      });
    } else {
      this.orderForm.patchValue({
        customerName: '',
        emailID: '',
        phoneNo: ''
      });
    }
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
        message: 'Submitting...',
        spinner: 'crescent',
      });
      await loading.present(); // Show the loader
      const shippingCharge = this.orderForm.value.deliveryMethod === 'selfPickup' ? 0 : 20;
      const formdata = new FormData();
      this.bookingCart.map((cartItem) => {
        formdata.append(`productID`, cartItem.product.productID);
        formdata.append(`atributeID`, cartItem.atributeID || '');
        formdata.append(`atributeItemID`, cartItem.atributeItemID || '');
        formdata.append(`quantity`, cartItem.quantity.toString());
        formdata.append(`slaughterCharge`, cartItem.slaughterCharge || '0.00');
        formdata.append(`cuttingAmount`, cartItem.cuttingAmount || '0');
        formdata.append(`orderTotal`, this.grandTotal + this.additionalCharge || '0');
        formdata.append(`payableAmount`, this.grandTotal || '0');
      });
      formdata.append('customerName', this.orderForm.value.customerName);
      formdata.append('deliveryMethod', this.orderForm.value.deliveryMethod);
      formdata.append('shippingCharge', shippingCharge.toString());
      formdata.append('addressType', this.orderForm.value.addressType);
      formdata.append('AddressTypeName', this.isCompany ? this.orderForm.value.companyName : '');
      formdata.append('buildingName_No', this.orderForm.value.buildingName_No);
      formdata.append('streetName_No', this.orderForm.value.streetName_No);
      formdata.append('landMark', this.orderForm.value.landMark || '');
      formdata.append('emailID', this.orderForm.value.emailID);
      formdata.append('phoneNo', '+974' + this.orderForm.value.phoneNo);
      formdata.append('city', this.orderForm.value.city);
      formdata.append('deliveryTime', this.orderForm.value.deliveryTime);
      formdata.append('paymentType', 'Self Payment');
      const deliveryDate = this.orderForm.value.DeliveryDate;

      const dateObj = new Date(deliveryDate);
      const formattedDate = dateObj.toISOString().split('T')[0]; // "2025-06-19"
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = weekdays[dateObj.getDay()]; // "Thu" in this case
      const finalString = `${formattedDate} ${dayName}`;
      formdata.append("deliveryDate", finalString) ;
      formdata.append('pickupLocation', this.orderForm.value.pickupLocation);


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
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
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
    this.handleAutocompleteFocus();
  }

  async initAutocomplete() {
    const inputElement = await this.cityInput.getInputElement();
    const options = {
      types: ['geocode'], // Includes broader geographical data
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

  private handleAutocompleteFocus() {
    const autocompleteInput = document.getElementById('autocompleteInput');

    if (autocompleteInput) {
      autocompleteInput.addEventListener('focus', () => {
        const pacContainer = document.querySelector('.pac-container');
        if (pacContainer) {
          this.adjustAutocompletePosition();
        }
      });
    }
  }

  onScroll(event: any) {
    this.adjustAutocompletePosition();
  }

  private adjustAutocompletePosition() {
    const input = document.getElementById('autocompleteInput');
    const pacContainer = document.querySelector('.pac-container') as HTMLElement;

    if (input && pacContainer) {
      const inputRect = input.getBoundingClientRect();
      const newTop = inputRect.top + inputRect.height;
      const newLeft = inputRect.left;
      this.renderer.setStyle(pacContainer, 'top', `${newTop}px`);
      this.renderer.setStyle(pacContainer, 'left', `${newLeft}px`);
      this.renderer.setStyle(pacContainer, 'position', 'fixed');
      this.renderer.setStyle(pacContainer, 'z-index', '9999');
    }
  }

  onSaveAddress(event: any) {
    const isChecked = event.detail.checked;
    this.orderForm.get('saveAddress')?.setValue(isChecked);

    if (isChecked) {
      const addressData = {
        city: this.orderForm.value.city,
        buildingName_No: this.orderForm.value.buildingName_No,
        streetName_No: this.orderForm.value.streetName_No,
        landMark: this.orderForm.value.landMark,
      };
      localStorage.setItem('savedAddress', JSON.stringify(addressData));
    } else {
      localStorage.removeItem('savedAddress');
    }
  }

  loadSavedAddress() {
    const savedAddress = localStorage.getItem('savedAddress');
    if (savedAddress) {
      const addressData = JSON.parse(savedAddress);
      this.orderForm.patchValue({
        city: addressData.city,
        buildingName_No: addressData.buildingName_No,
        streetName_No: addressData.streetName_No,
        landMark: addressData.landMark,
        saveAddress: true, // Set checkbox to checked if data exists
      });
    }
  }

}


