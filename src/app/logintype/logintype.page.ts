import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-logintype',
  templateUrl: './logintype.page.html',
  styleUrls: ['./logintype.page.scss'],
})
export class LogintypePage implements OnInit {
  currentLanguage: string | 'en' | undefined;
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private lan: LanguageService
  ) { }

  ngOnInit() {
    this.currentLanguage = this.lan.getCurrentLanguage();
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

  navigateToShipping() {
    this.router.navigate(['shipping-info']);
  }

  onBack() {
    this.navCtrl.back();
  }

}
