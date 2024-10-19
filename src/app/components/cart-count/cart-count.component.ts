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
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
}
