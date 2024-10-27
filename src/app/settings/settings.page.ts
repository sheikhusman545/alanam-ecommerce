import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { LanguagePopoverComponent } from '../components/language-popover/language-popover.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentLanguage: string;

  constructor(
    private languageService: LanguageService,
    private modalController: ModalController,
    private popoverController: PopoverController

  ) { 
    this.currentLanguage = this.languageService.getCurrentLanguage(); // Get the current language
  }

  // Dismiss modal
  dismissModal() {
    this.modalController.dismiss();
    
  }

  switchLanguage(language: string) {
    this.currentLanguage = this.languageService.switchLanguage(language);
  }

  async openPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent, // Optional: or use ng-template inline in HTML
      event,
      translucent: true,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      this.currentLanguage = data; // Assign popover returned language to currentLanguage
    }
  }

  ngOnInit() {
  }

}
