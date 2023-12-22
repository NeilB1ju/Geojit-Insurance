import { NgModule } from '@angular/core';


import { SharedModule } from "shared";
import { CommonFileUploadComponent } from './common-file-upload.component';

@NgModule({
  imports: [
    SharedModule,    

  ],
  
  declarations: [
    CommonFileUploadComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [CommonFileUploadComponent],
})
export class CommonFileUploadModule { }
