import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Homepage2PageRoutingModule } from './homepage-2-routing.module';
import { Homepage2Page } from './homepage-2.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguagePopoverComponent } from '../components/language-popover/language-popover.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Homepage2PageRoutingModule,
    TranslateModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [Homepage2Page, LanguagePopoverComponent],
})
export class Homepage2PageModule {}
