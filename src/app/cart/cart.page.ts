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
  cartCount = this.cartService.cartItemCount$ || 0;
  count = 0;
  currentLanguage: string | 'en' | undefined;
  

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private languageService: LanguageService

  ) { }

  ngOnInit() {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
      console.log(this.cartItems.length);

    });
      this.cartCount.subscribe((count: any) => {
        this.count = count;
      });

   
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.addProduct(item);
    this.calculateTotal();
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.removeProduct(item.productId, item.productAttributes);
    this.calculateTotal();
  }

  removeItem(item: CartItem) {
    this.cartService.removeProduct(item.productId, item.productAttributes);
    this.calculateTotal();
  }

  
  private calculateTotal(){
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
