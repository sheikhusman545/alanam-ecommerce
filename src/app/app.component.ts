import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';


register();
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router
  ) {
    this.initializeApp();

  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Handle back button for Android
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.router.url === '/home') {
          // If the user is on the home page, exit the app
          (navigator as any).app.exitApp();
        } else {
          // Otherwise, navigate back to the previous page
          window.history.back();
        }
      });
    });
  }
}
