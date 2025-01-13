import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentPageRoutingModule } from './payment-routing.module';
import { PaymentPage } from './payment.page';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentMethodModalComponent } from '../components/payment-method-modal/payment-method-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [PaymentPage, PaymentMethodModalComponent],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaymentPageModule {}
