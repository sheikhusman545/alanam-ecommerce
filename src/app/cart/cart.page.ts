import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  cartSubscription!: Subscription;
  cartCount = this.cartService.cartItemCount$ || 0;
  count = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });
      console.log('Cart updated:', this.cartItems);
      this.cartCount.subscribe((count: any) => {
        this.count = count;
      });

      this.calculateTotal();
   
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.addProduct(item);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.removeProduct(item.productId, item.productAttributes);
    this.calculateTotal();
  }

  removeItem(item: CartItem) {
    this.cartService.removeProduct(item.productId, item.productAttributes);
    this.calculateTotal();
  }

  
  private calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum: number, item) => {
      return sum + Number(item.totalPrice) + Number(item.slaughterCharge) * Number(item.quantity); // Convert to number
    }, 0);
  }

  proceedToCheckout() {
    if(this.cartItems.length === 0) {
      return;
    }
    this.isAuthenticated();
    

  }

  isAuthenticated() {
    this.authService.check().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['payment']);
      } else {
        this.router.navigate(['guest']);
      }
    });
  }


}
