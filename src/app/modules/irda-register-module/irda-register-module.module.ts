import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { IRDARegisterComponent } from './irda-register.component';
import { NzFormModule } from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [IRDARegisterComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NzFormModule
   
  ],
  bootstrap: [IRDARegisterComponent],
})
export class IRDARegisterModuleModule { }
