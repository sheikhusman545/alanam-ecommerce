import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDescriptionPageRoutingModule } from './product-description-routing.module';

import { ProductDescriptionPage } from './product-description.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDescriptionPageRoutingModule,
    TranslateModule
  ],
  declarations: [ProductDescriptionPage]
})
export class ProductDescriptionPageModule {}
