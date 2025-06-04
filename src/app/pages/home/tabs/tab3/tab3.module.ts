import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AddEditBebidaModule } from 'src/app/components/agregar-bebida/add-edit-bebida.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';

import { Tab3Page } from './tab3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab3PageRoutingModule,
    AddEditBebidaModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
