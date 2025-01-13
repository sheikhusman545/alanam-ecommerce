import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service'; // Import the service where you get session ID
import { Browser } from '@capacitor/browser';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

declare global {
    interface Window {
        myfatoorah: any;
    }
}
@Component({
  selector: 'app-embedded-payment',
  templateUrl: './embedded-payment.page.html',
  styleUrls: ['./embedded-payment.page.scss'],
})
export class EmbeddedPaymentPage implements OnInit {
  sessionId!: string;
    amount: number = 1; // Hardcoded for now, you can fetch from elsewhere
    currencyCode: string = 'QAR';
    countryCode: string = 'QAT';
    cartItems: CartItem[] = [];
    totalAmount = 0;
    cartSubscription!: Subscription;


    @ViewChild('unifiedSession', { static: true }) unifiedSession!: ElementRef;
    @ViewChild('gpCardElement', { static: true }) gpCardElement!: ElementRef;
    cartCount: any;
    count: any;

    constructor(
        private paymentService: PaymentService,
        private cartService: CartService,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private router: Router
    ) { }

   async ngOnInit() {
        await this.presentLoading('Loading...');

        this.subscribeToCart();
        this.calculateTotalAmount();
        this.loadingController.dismiss();

        this.paymentService.getEmbeddedSession().subscribe((response: any) => {
            this.sessionId = response.successMessages.sessionId.trim();
            this.initializePayment();
        });

   }
    
   private subscribeToCart() {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });

    // this.cartCount.subscribe((count: any) => {
    //   this.count = count;
    // });

  }

  private calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((sum, item) => {
      const itemTotal =
        (Number(item.price) * Number(item.quantity)) +
        (Number(item.quantity) * Number(item.slaughterCharge));
      return sum + itemTotal;
    }, 0);
  }

    initializePayment() {
        const script = document.createElement('script');
        script.src = 'https://qa.myfatoorah.com/payment/v1/session.js';
        script.async = true;

        script.onload = () => {
            this.setupPaymentConfig();
        };

        script.onerror = () => {
            console.error('Failed to load MyFatoorah script');
        };

        document.body.appendChild(script);
    }

    setupPaymentConfig() {
        const config = {
            sessionId: this.sessionId,
            countryCode: this.countryCode,
            currencyCode: this.currencyCode,
            amount: this.totalAmount.toString(),
            callback: this.handlePayment.bind(this),
            containerId: 'unified-session',
            paymentOptions: ['ApplePay', 'GooglePay', 'Card'],
            supportedNetworks: ['visa', 'masterCard', 'mada', 'amex'],
            language: 'en',
            settings: {
                googlePay: {
                    containerId: 'gp-card-element',
                    style: {
                        frameHeight: '40px',
                        frameWidth: '100%',
                        button: {
                            height: '40px',
                            type: 'pay',
                            borderRadius: '4px',
                            color: 'black',
                            language: 'en'
                        }
                    }
                },
                applePay: {
                    style: {
                        frameHeight: '40px',
                        frameWidth: '100%',
                        button: {
                            height: '40px',
                            type: 'pay',
                            borderRadius: '4px'
                        }
                    }
                },
                card: {
                    style: {
                        cardHeight: '150px',
                        tokenHeight: '150px',
                        input: {
                            color: '#333',
                            fontSize: '14px',
                            fontFamily: 'Arial, sans-serif',
                            inputHeight: '36px',
                            inputMargin: '8px 0',
                            borderColor: '#ddd',
                            borderWidth: '1px',
                            borderRadius: '4px',
                            placeHolder: {
                                holderName: 'Name On Card',
                                cardNumber: 'Card Number',
                                expiryDate: 'MM/YY',
                                securityCode: 'CVV'
                            }
                        },
                        button: {
                            textContent: 'Pay Now',
                            fontSize: '14px',
                            color: 'white',
                            backgroundColor: '#6c2835',
                            height: '36px',
                            borderRadius: '4px',
                            width: '100%',
                            margin: '8px 0',
                            cursor: 'pointer'
                        }
                    }
                }
            }
        };

        try {
            if (window.myfatoorah) {
                window.myfatoorah.init(config);
            } else {
                console.error('MyFatoorah not initialized');
            }
        } catch (error) {
            console.error('Error initializing MyFatoorah:', error);
        }
    }

    handlePayment(response: any) {
        try {
            if (response.isSuccess) {

                // Handle success
                localStorage.setItem('paymentResponse', JSON.stringify(response));
                const paymentData = {
                    orderNo: Number(localStorage.getItem('orderNo')),
                    methodId: 2,
                    IsEmbeddedSupported: true,
                    sessionId: response.sessionId
                };
                this.paymentService.executePayment(paymentData).subscribe(async response => {
                    if (response.successMessages.redirectionURL != null) {
                        let link = response.successMessages.redirectionURL;
                        this.cartService.clearCart();
                        await Browser.open({ url: link });
                        this.presentSuccessAlert("You are redirecting to payment gateway once you approved you will get an email from us. Please make payment.");
                        this.router.navigate(['/tabs/home']);

                    }
                }, error => {
                    console.error('Payment Error:', error);
                });

                ///   this.paymentService.executePayment(paymentData).subscribe((response: any) => { });
                // You can perform actions based on payment type
                switch (response.paymentType) {
                    case 'ApplePay':
                        break;
                    case 'GooglePay':
                        break;
                    case 'Card':
                        break;
                }
            } else {
                console.error('Payment failed:', response);
            }
        } catch (error) {
            console.error('Error in payment callback:', error);
        }
    }
    async presentLoading(message: string) {
        const loading = await this.loadingController.create({
          message: message,
          spinner: 'crescent'
        });
        await loading.present();
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

}
