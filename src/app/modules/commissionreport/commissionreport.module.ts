import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { commissionreportComponent,TableFilterPipe } from "./commissionreport.component";


@NgModule({
  imports: [
    SharedModule,    

  ],
  declarations: [
    commissionreportComponent,
       TableFilterPipe
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [commissionreportComponent],
})

export class commissionreportModule { }
