import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingInfoPageRoutingModule } from './shipping-info-routing.module';

import { ShippingInfoPage } from './shipping-info.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingInfoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ShippingInfoPage]
})
export class ShippingInfoPageModule {}
