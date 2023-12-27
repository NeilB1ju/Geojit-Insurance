import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { persistencyreport,TableFilterPipe } from "./persistencyreport.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";

@NgModule({
  imports: [
    SharedModule,
    PolicyDetailsModule
  ],
  declarations: [
    persistencyreport,
    TableFilterPipe
  ],
  providers: [
  ],
  bootstrap: [persistencyreport],
})

export class persistencyreportModule { }
