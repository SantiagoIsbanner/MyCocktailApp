import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AddEditBebidaComponent } from './add-edit-bebida.component';

@NgModule({
  declarations: [AddEditBebidaComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [AddEditBebidaComponent]
})
export class AddEditBebidaModule {}