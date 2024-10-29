import { Component, ElementRef, OnInit, ViewChild ,NgZone} from '@angular/core';
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



  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private httpClient: HttpClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
    private cartService: CartService,
    private datePipe: DatePipe,
    private loadingController: LoadingController,
    private lan: LanguageService,
    private ngZone: NgZone,
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
      companyName: [''],
      buildingName_No: ['', Validators.required],
      streetName_No: ['', Validators.required],
      landMark: ['', Validators.required],
      deliveryTime: ['10AM-12PM', Validators.required],
      zoneNo: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.currentLanguage = this.lan.getCurrentLanguage();
    await this.presentLoading('Loading...');
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });
    this.cartCount.subscribe((count: any) => {
      this.count = count;
    });
    this.totalAmount = this.cartItems.reduce((sum: number, item) => {
      return sum + Number(item.totalPrice) + Number(item.slaughterCharge) * Number(item.quantity);
    }, 0);

    this.authService.getUserDetails$().subscribe((userDetails) => {
      if (userDetails && userDetails.customerName) {
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
    });
    this.loadingController.dismiss();
  }

  onAddressTypeChange(event: any) {
    this.isCompany = event.detail.value === 'company';
    if (!this.isCompany) {
      this.orderForm.patchValue({ companyName: '' });
    }
  }

  async onSubmit() {
    if (this.orderForm.valid) {
      await this.presentLoading('Submitting your order...');
      let formData = new FormData();

      this.cartItems.forEach((product, index) => {
        formData.append(`products[${index}][productID]`, product.product.productID.toString());
        formData.append(`products[${index}][productPrice]`, product.product.productPrice.toString());
        formData.append(`products[${index}][SlaughterCharge]`, product.product.SlaughterCharge.toString());
        formData.append(`products[${index}][packingCharge]`, product.product.packingCharge ? product.product.packingCharge : '0');
        formData.append(`products[${index}][productQuantity]`, product.quantity.toString());
        let amount = 
          Number(product.totalPrice) + 
          Number(product.slaughterCharge) * 
          Number(product.quantity);
      
        formData.append(`products[${index}][productAmount]`, amount.toFixed(2).toString());  
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
        this.loadingController.dismiss();
        if (response.respondStatus === 'SUCCESS') {
          let link = response.successMessages.redirectionURL;
          this.cartService.clearCart();
          await Browser.open({ url: link });
          this.presentSuccessAlert("You are redirecting to payment gateway once you approved you will get an email from us. Please make payment.");
          this.router.navigate(['/tabs/home']);
        } else {
          console.error('Error submitting order', response);
        }
      }, error => {
        console.error('Error submitting order', error);
        this.loadingController.dismiss();
      });
     
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
      message: 'Any order before 3 PM will be delivered the same day. Orders after 3 PM will be delivered the next day. Estimated delivery time: 3-5 business days.',
      duration: 5000,
      position: 'top',
      color: 'light',
    });

    await toast.present();
  }

  goToCheckout() {
    this.router.navigate(['/tabs/cart']);
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
      types: ['(cities)'],
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
