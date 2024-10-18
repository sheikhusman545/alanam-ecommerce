import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchProductPageRoutingModule } from './search-product-routing.module';
import { SearchProductPage } from './search-product.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchProductPageRoutingModule,
    TranslateModule
  ],
  declarations: [SearchProductPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class SearchProductPageModule {}
