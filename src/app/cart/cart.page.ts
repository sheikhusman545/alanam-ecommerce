import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { ProductsService } from '../services/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  cartSubscription!: Subscription;
  cartCountSubscription!: Subscription;
  count = 0;
  currentLanguage: string | undefined = 'en';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private languageService: LanguageService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
   // this.currentLanguage = this.languageService.getCurrentLanguage() || 'en';
   this.subscriptions.add(
    this.languageService.language$.subscribe((language) => {
      this.currentLanguage = language;
      console.log(`Language changed to: ${language}`);
    })
  );
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });

    this.cartCountSubscription = this.cartService.cartItemCount$.subscribe((count) => {
      this.count = count || 0;
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.cartCountSubscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.addProduct(item);
    this.calculateTotal();
  }

  decreaseQuantity(item: CartItem, quantity: number, itemCount: number) {
    const removalCount = itemCount <= quantity ? quantity : 1;
    for (let i = 0; i < removalCount; i++) {
      this.cartService.removeProduct(item.productId, item.productAttributes);
    }
    this.calculateTotal();
  }

  removeItem(item: CartItem, quantity: number) {
    for (let i = 0; i < quantity; i++) {
      this.cartService.removeProduct(item.productId, item.productAttributes);
    }
    this.calculateTotal();
  }

  private calculateTotal() {
    this.totalAmount = this.cartItems.reduce((sum, item) => {
      const itemTotal = (Number(item.price) * Number(item.quantity)) + (Number(item.quantity) * Number(item.slaughterCharge))
      +( Number(item.quantity) * Number(item.cuttingAmount));
      return sum + itemTotal;
    }, 0);
    this.totalAmount = Number(this.totalAmount.toFixed(2));

  }

  // proceedToCheckout() {
  //   if (this.cartItems.length === 0) return;
  //   this.isAuthenticated();
  // }


async proceedToCheckout() {
  if (this.cartItems.length === 0) return;

  const productIds = this.cartItems.map(item => String(item.productId));

  try {
    const pricesObservable = this.productsService.getProductPrices(productIds);
    if (!pricesObservable) {
      console.error('No product prices observable returned.');
      return;
    }
    const response = await firstValueFrom(pricesObservable);
    console.log('Product prices response:', response.requestedData.PrdPrices);

    if (response) {
      this.cartService.updatePrices(response.requestedData.PrdPrices);
      this.calculateTotal();
    }

    this.isAuthenticated();
  } catch (err) {
    console.error('Error fetching product prices:', err);
  }
}



  isAuthenticated() {
    this.authService.check().subscribe({
      next: (isAuthenticated) => {
        const route = isAuthenticated ? 'payment' : 'guest';
        this.router.navigate([route]);
      },
      error: (err) => {
        console.error('Authentication check failed', err);
      },
    });
  }
}
