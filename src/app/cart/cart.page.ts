import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

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
  currentLanguage: string = 'en';

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.languageService.getCurrentLanguage() || 'en';

    // Subscribe to cart changes and update items & total
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });

    // Subscribe to cart item count
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
      const itemTotal = Number(item.totalPrice) + (Number(item.slaughterCharge) * Number(item.quantity));
      return sum + itemTotal;
    }, 0);
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) return;
    this.isAuthenticated();
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
