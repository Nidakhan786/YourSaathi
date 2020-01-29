import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnonycounselPage } from './anonycounsel.page';

const routes: Routes = [
  {
    path: '',
    component: AnonycounselPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnonycounselPageRoutingModule {}
