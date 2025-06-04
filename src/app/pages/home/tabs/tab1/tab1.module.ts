import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ModalPreparacionModule } from 'src/app/components/modal-preparacion/modal-preparacion.module';

import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1PageRoutingModule,
    ModalPreparacionModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}