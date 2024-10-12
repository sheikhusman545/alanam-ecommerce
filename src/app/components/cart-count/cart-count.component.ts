import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-count',
  template: `
    <ion-badge color="primary">{{ this.cartCount }} </ion-badge>
  `,
  styles: [`
    ion-badge {
      font-size: 1.2em;
      padding: 8px;
    }
  `]
})
export class CartCountComponent implements OnInit {
  cartCount = 0;
  constructor(private cartService: CartService) { }

  ngOnInit() {
    // Log to verify the component is initializing
    console.log('CartCountComponent initialized');

    this.cartService.cartItemCount$.subscribe(count => {
      this.cartCount = count;
      console.log('Updated cart count:', count); // Verify count changes
    });
  }
}
