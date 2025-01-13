import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmbeddedPaymentPage } from './embedded-payment.page';

const routes: Routes = [
  {
    path: '',
    component: EmbeddedPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmbeddedPaymentPageRoutingModule {}
