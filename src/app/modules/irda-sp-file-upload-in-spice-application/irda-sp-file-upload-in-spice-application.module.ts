import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IrdaSpFileUploadInSpiceApplicationComponent } from './irda-sp-file-upload-in-spice-application.component';
import { SharedModule } from 'shared';



@NgModule({
  declarations: [IrdaSpFileUploadInSpiceApplicationComponent],
  imports: [
    CommonModule,SharedModule
  ],
  bootstrap: [IrdaSpFileUploadInSpiceApplicationComponent],

  
})
export class IRDASPFileUploadInSpiceApplicationModule { }
