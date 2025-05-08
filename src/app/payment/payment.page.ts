import { Component, ElementRef, OnInit, ViewChild, NgZone, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/http.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { DatePipe } from '@angular/common';
import { Browser } from '@capacitor/browser';
import Swiper from 'swiper';
import { IonInput } from '@ionic/angular';
import { LanguageService } from '../services/language.service';
import { PaymentMethodModalComponent } from '../components/payment-method-modal/payment-method-modal.component';
import { PaymentService } from '../services/payment.service';
import { HttpHeaders } from '@angular/common/http';
declare var google: any;

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
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentLanguage: string | 'en' | undefined;
  selectedLocation: { lat: number; lng: number } | null = null;
  @ViewChild('cityInput', { static: false }) cityInput!: IonInput;
  ID: any;
  apiErrors: { [key: string]: string } = {};
  additionalCharge: number = 0;
  private subscriptions: Subscription = new Subscription();
  private token: any = localStorage.getItem('JWT_Token'); 
  
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
    private cartService: CartService,
    private datePipe: DatePipe,
    private loadingController: LoadingController,
    private languageService: LanguageService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private paymentService: PaymentService,
    private modalController: ModalController
  ) {
    const now = new Date();
    this.formattedDate = this.datePipe.transform(now, 'dd-MM-yyyy EEE') as string;
    this.orderForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', Validators.required],
      deliveryMethod: ['selfPickup', Validators.required],
      addressType: ['individual', Validators.required],
      landMark: ['', Validators.required],
      companyName: [''],
      buildingName_No: ['', Validators.required],
      streetName_No: ['', Validators.required],
      deliveryTime: ['10AM-01PM', Validators.required],
      zoneNo: ['', Validators.required],
      saveAddress: [false]

    });
  }
  async ngOnInit() {
    //this.currentLanguage = this.lan.getCurrentLanguage();
    this.subscriptions.add(
      this.languageService.language$.subscribe((language) => {
        this.currentLanguage = language;
        console.log(`Language changed to: ${language}`);
      })
    );
    await this.presentLoading('Loading...');

    this.subscribeToCart();
    this.calculateTotalAmount();
    this.checkUserInfo();
    this.ifDoorStepDelivery();
    this.loadSavedAddress();
    this.loadingController.dismiss();
  }

  private subscribeToCart() {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });

    this.cartCount.subscribe((count: any) => {
      this.count = count;
    });
  }

  private calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((sum, item) => {
      const itemTotal =
        (Number(item.price) * Number(item.quantity)) +
        (Number(item.quantity) * Number(item.slaughterCharge));
      return sum + itemTotal;
    }, 0);
    this.totalAmount = Number(this.totalAmount.toFixed(2));
  }

  onAddressTypeChange(event: any) {
    this.isCompany = event.detail.value === 'company';
    if (!this.isCompany) {
      this.orderForm.patchValue({ companyName: '' });
    }
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

  async onSubmit() {
    if (this.orderForm.valid) {
      await this.presentLoading('Redirecting to Payment Gateway...');
      this.saveOrderData('');
      //this.loadingController.dismiss();
    } else {
      this.orderForm.markAllAsTouched();
      console.log('Invalid form');
      this.loadingController.dismiss();

    }
  }

  navigateToPayment(Object: any) {
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

  saveOrderData(paymentMethod?: any) {


    let formData = new FormData();
    const shippingCharge = this.orderForm.value.deliveryMethod === 'selfPickup' ? 0 : 20;
    this.cartItems.forEach((product, index) => {
      formData.append(`products[${index}][productID]`, product.product.productID.toString());
      formData.append(`products[${index}][productPrice]`, product.product.productPrice.toString());
      formData.append(`products[${index}][SlaughterCharge]`, product.product.SlaughterCharge.toString());
      formData.append(`products[${index}][packingCharge]`, product.product.packingCharge ? product.product.packingCharge : undefined);
      formData.append(`products[${index}][productQuantity]`, product.quantity.toString());
      let amount = Number(product.totalPrice)
      formData.append(`products[${index}][productAmount]`, amount.toFixed(2).toString());
      formData.append(`products[${index}][productAttributes]`, JSON.stringify(product.productAttributes));
    });

    formData.append("totalProductsQuantity", this.count);
    formData.append("totalProductPrice", this.totalAmount.toString());
    formData.append("shippingCharge", shippingCharge.toString());
    formData.append("shippingDiscount", "0");
    formData.append("couponDiscount", "0");
    formData.append("otherDiscount", "0");
    formData.append("grantTotal", (this.totalAmount + shippingCharge).toString());
    formData.append("paymentType", "Online");
    //formData.append("DeliveryMethod", this.orderForm.value.deliveryMethod);
    formData.append("DeliveryMethod", paymentMethod.PaymentMethodEn);
    formData.append("DeliveryDate", this.formattedDate);
    formData.append("DeliveryTime", ''); //this.orderForm.value.deliveryTime
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

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'X-Auth-Token': this.token || ''
    });

    this.httpClient.post('ecom/cart/mobile', formData, { headers }).subscribe(async response => {

      if (response.respondStatus == 'SUCCESS') {
        await Browser.open({ url: response.successMessages.paymentLink });
        this.loadingController.dismiss();
        this.presentSuccessAlert("You are redirecting to payment gateway once you approved you will get an email from us. Please make payment.");
        this.router.navigate(['/tabs/home']);
      }
    }, error => {
      console.log("errror ", 'Error submitting order', error);
      this.loadingController.dismiss();
    });

  }

  async openPaymentMethods() {
    await this.presentLoading('Loading');
    this.paymentService.initiatePayment().subscribe(
      async (response: any) => {
        const paymentMethods = response.successMessages.paymenttype;

        // Open modal with payment methods
        const modal = await this.modalController.create({
          component: PaymentMethodModalComponent,
          componentProps: { paymentMethods },
        });

        // Present the modal
        await modal.present();
        this.loadingController.dismiss();
        // Handle the modal dismissal
        const { data } = await modal.onDidDismiss();

        if (data) {
          this.processSelectedPayment(data);
        } else {
          console.log('Modal dismissed without selecting a payment method.');
        }
      },
      (error) => {
        console.error('Error fetching payment methods:', error);
      }
    );
  }

  processSelectedPayment(paymentMethod: any) {
    this.saveOrderData(paymentMethod);
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  async handleErrors(response: any) {
    this.apiErrors = response;
    await this.presentErrorAlert();

  }

  formatErrors(errors: { [key: string]: string }): string {
    return Object.values(errors).join('\n');
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: this.formatErrors(this.apiErrors),
      buttons: ['OK']
    });
    await alert.present();
  }


  async presentSuccessAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: msg,
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
      message: 'Any order before 3 PM will be delivered the same day. Orders after 3 PM will be delivered the next day.',
      duration: 5000,
      position: 'top',
      color: 'light',
    });

    await toast.present();
  }


  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent'
    });
    await loading.present();
  }

  ngAfterViewInit() {
    this.initAutocomplete();
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
  AfterViewInit() {
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

  onBack() {
    this.navCtrl.back();
  }
  goToCheckout() {
    this.router.navigate(['/tabs/cart']);
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
        zoneNo: this.orderForm.value.zoneNo,
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
        zoneNo: addressData.zoneNo,
        saveAddress: true, // Set checkbox to checked if data exists
      });
    }
  }

}

