import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogintypePageRoutingModule } from './logintype-routing.module';

import { LogintypePage } from './logintype.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogintypePageRoutingModule,
    TranslateModule
  ],
  declarations: [LogintypePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogintypePageModule {}
