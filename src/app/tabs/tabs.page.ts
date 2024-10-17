import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  count =   0;
  constructor(
    private cartService: CartService
  ) {}
  ngOnInit() {
  this.cartService.cartItemCount$.subscribe((count) => (this.count = count));
  }
}
