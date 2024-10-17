import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingInfoPageRoutingModule } from './shipping-info-routing.module';

import { ShippingInfoPage } from './shipping-info.page';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingInfoPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [ShippingInfoPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShippingInfoPageModule {}
