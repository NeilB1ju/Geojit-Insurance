import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { CommonReportsComponent,TableFilterPipe } from "./common-reports.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  imports: [
    SharedModule,    
    PolicyDetailsModule,
    ReactiveFormsModule,
    NzFormModule
   
  ],
  declarations: [
      CommonReportsComponent,
       TableFilterPipe
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [CommonReportsComponent],
})

export class commonreportsModule { }
