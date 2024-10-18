import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuestPageRoutingModule } from './guest-routing.module';

import { GuestPage } from './guest.page';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestPageRoutingModule,
    TranslateModule
  ],
  declarations: [GuestPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GuestPageModule {}
