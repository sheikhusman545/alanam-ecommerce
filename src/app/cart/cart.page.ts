import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  ngOnInit() {
    
  }
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']); // Navigate to home page
  }
}
