import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { reconcilationreportcommission,TableFilterPipe } from "./reconcilationreportcommission.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";

@NgModule({
  imports: [
    SharedModule,
    PolicyDetailsModule
  ],
  declarations: [
    reconcilationreportcommission,
    TableFilterPipe
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [reconcilationreportcommission],
})

export class reconcilationreportcommissionModule { }
