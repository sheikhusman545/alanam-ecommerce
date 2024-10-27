import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ModalController } from '@ionic/angular';
import { SettingsPage } from '../settings/settings.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  count = 0;
  constructor(
    private cartService: CartService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.cartService.cartItemCount$.subscribe((count) => (this.count = count));
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsPage 
    });
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }


}
