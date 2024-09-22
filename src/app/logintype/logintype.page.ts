import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-logintype',
  templateUrl: './logintype.page.html',
  styleUrls: ['./logintype.page.scss'],
})
export class LogintypePage implements OnInit {

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
    this.router.navigate(['shipping-info']);
  }


}
