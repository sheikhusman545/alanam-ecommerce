import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { LanguagePopoverComponent } from '../components/language-popover/language-popover.component';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  currentLanguage: string | undefined;
  ID: any = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private languageService: LanguageService,
    private modalController: ModalController,
    private popoverController: PopoverController,
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.subscriptions.add(
      this.languageService.language$.subscribe((language) => {
        this.currentLanguage = language;
        console.log(`Language updated to: ${language}`);
      })
    );
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  // Dismiss modal
  dismissModal() {
    this.modalController.dismiss();
  }

  switchLanguage(language: string) {
    this.languageService.switchLanguage(language); // Update language via the service
  }

  async openPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event,
      translucent: true,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      this.languageService.switchLanguage(data); // Update language via the service
    }
  }

  openWhatsApp() {
    window.open('https://wa.me/97450375555', '_blank');
  }
}

// import { Component, OnInit } from '@angular/core';
// import { LanguageService } from '../services/language.service';
// import { ModalController, PopoverController } from '@ionic/angular';
// import { LanguagePopoverComponent } from '../components/language-popover/language-popover.component';
// import { AuthService } from '../services/auth.service';
// import { AlertController } from '@ionic/angular';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-settings',
//   templateUrl: './settings.page.html',
//   styleUrls: ['./settings.page.scss'],
// })
// export class SettingsPage implements OnInit {
//   currentLanguage: string;
//   ID: any = '';

//   constructor(
//     private languageService: LanguageService,
//     private modalController: ModalController,
//     private popoverController: PopoverController,
//     private authService: AuthService,
//     private alertController: AlertController,
//     private router: Router

//   ) {
//     this.currentLanguage = this.languageService.getCurrentLanguage(); // Get the current language
//   }

//   // Dismiss modal
//   dismissModal() {
//     this.modalController.dismiss();
    
//   }

//   switchLanguage(language: string) {
//     this.currentLanguage = this.languageService.switchLanguage(language);
//   }

//   async openPopover(event: Event) {
//     const popover = await this.popoverController.create({
//       component: LanguagePopoverComponent, // Optional: or use ng-template inline in HTML
//       event,
//       translucent: true,
//     });
//     await popover.present();
//     const { data } = await popover.onDidDismiss();
//     if (data) {
//       this.currentLanguage = data; // Assign popover returned language to currentLanguage
//     }
//   }

//   ngOnInit() {
//   }
  

//   openWhatsApp() {
//     window.open('https://wa.me/97450375555', '_blank');
//   }

  
// }
