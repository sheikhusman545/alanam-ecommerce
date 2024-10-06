import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Homepage2Page } from './homepage-2.page';

const routes: Routes = [
  {
    path: '',
    component: Homepage2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Homepage2PageRoutingModule {}
