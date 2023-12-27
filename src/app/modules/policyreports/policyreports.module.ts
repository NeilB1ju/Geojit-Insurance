import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { policyreportsComponent,TableFilterPipe } from "./policyreports.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";
import { policywithlocationModule } from '../policywithlocation/policywithlocation.module';


@NgModule({
  imports: [
    SharedModule,    
    PolicyDetailsModule,
    policywithlocationModule
    
  ],
  declarations: [
    policyreportsComponent,
       TableFilterPipe
  ],
  providers: [
  ],
  bootstrap: [policyreportsComponent],
})

export class policyreportsModule { }
