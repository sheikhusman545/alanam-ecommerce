import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {LanguageService} from '../services/language.service';
@Component({
  selector: 'app-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
})
export class GuestPage implements OnInit {
  currentLanguage: string | 'en' | undefined;
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private lan: LanguageService
  ) { }

  ngOnInit() {
    this.currentLanguage =  this.lan.getCurrentLanguage();
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
