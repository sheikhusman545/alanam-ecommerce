import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoriesPageRoutingModule } from './categories-routing.module';
import { CategoriesPage } from './categories.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    TranslateModule
  ],
  declarations: [CategoriesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriesPageModule {}
