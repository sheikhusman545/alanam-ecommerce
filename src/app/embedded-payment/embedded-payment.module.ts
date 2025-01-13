import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmbeddedPaymentPageRoutingModule } from './embedded-payment-routing.module';

import { EmbeddedPaymentPage } from './embedded-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmbeddedPaymentPageRoutingModule
  ],
  declarations: [EmbeddedPaymentPage]
})
export class EmbeddedPaymentPageModule {}
