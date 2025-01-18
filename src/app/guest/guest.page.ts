import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
})
export class GuestPage implements OnInit {
  currentLanguage: string | 'en' | undefined;
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    //    this.currentLanguage =  this.lan.getCurrentLanguage();
    this.subscriptions.add(
      this.languageService.language$.subscribe((language) => {
        this.currentLanguage = language;
        console.log(`Language changed to: ${language}`);
      })
    );
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
