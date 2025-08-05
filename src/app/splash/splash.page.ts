import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  animationClass = '';

  constructor(
    private platform: Platform,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    await this.platform.ready();

    // Wait 3s BEFORE starting animation
    setTimeout(() => {
      this.animationClass = 'animate';

      // Wait for animation duration (3s) before navigating
      setTimeout(() => {
        this.navCtrl.navigateRoot('tabs/home');
      }, 300);
    }, 3000);
  }
}
