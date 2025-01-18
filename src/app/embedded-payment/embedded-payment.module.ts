import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmbeddedPaymentPageRoutingModule } from './embedded-payment-routing.module';

import { EmbeddedPaymentPage } from './embedded-payment.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmbeddedPaymentPageRoutingModule,
    TranslateModule
  ],
  declarations: [EmbeddedPaymentPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmbeddedPaymentPageModule {}
