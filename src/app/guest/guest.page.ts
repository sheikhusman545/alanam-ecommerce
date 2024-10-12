import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
})
export class GuestPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

  navigateToShipping() {
    this.router.navigate(['payment']);
  }

  onBack() {
    this.navCtrl.back();
  }

}
