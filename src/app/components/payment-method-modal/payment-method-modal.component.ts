import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-method-modal',
  templateUrl: './payment-method-modal.component.html',
  styleUrls: ['./payment-method-modal.component.scss']
})
export class PaymentMethodModalComponent {
  @Input() paymentMethods: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  selectPaymentMethod(paymentMethod: any) {
    this.modalCtrl.dismiss(paymentMethod);
  }
}
