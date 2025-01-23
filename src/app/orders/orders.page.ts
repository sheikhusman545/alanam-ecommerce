import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orders: any[] = [];
  private subscriptions: Subscription = new Subscription();
  currentLanguage: string|undefined = 'en';
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.languageService.language$.subscribe((language) => {
        this.currentLanguage = language;
        console.log(`Language changed to: ${language}`);
      })
    );
    this.getOrders();
  }

  getOrders() {
    this.ordersService.getOrders().subscribe((data:any) => {
      this.orders = data.requestedData.Orders;
    });
  }
  goBack() {
    this.router.navigate(['/tabs/user-profile']);
  }
}
