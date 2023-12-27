import { NgModule } from '@angular/core';
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";
import { SharedModule } from 'shared';
import { InsuranceCompanywiseRptComponent,TableFilterPipe } from "./insurance-companywise-rpt.component";

@NgModule({
  imports: [
    SharedModule,
     PolicyDetailsModule
  ],
  declarations: [
      InsuranceCompanywiseRptComponent,
       TableFilterPipe
  ],
  providers: [
  ],
  bootstrap: [InsuranceCompanywiseRptComponent],
})

export class InsuranceCompanywiseRptModule { }
