import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnonycounselPageRoutingModule } from './anonycounsel-routing.module';

import { AnonycounselPage } from './anonycounsel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnonycounselPageRoutingModule
  ],
  declarations: [AnonycounselPage]
})
export class AnonycounselPageModule {}
