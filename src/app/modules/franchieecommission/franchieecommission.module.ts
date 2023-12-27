import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { franchieecommissionComponent,TableFilterPipe } from "./franchieecommission.component";
import { policywithlocationModule } from "../../modules/policywithlocation/policywithlocation.module";

@NgModule({
  imports: [
    SharedModule,    
    policywithlocationModule,
  ],
  declarations: [
    franchieecommissionComponent,
       TableFilterPipe
  ],
  providers: [
  ],
  bootstrap: [franchieecommissionComponent],
})

export class franchieecommissionModule { }
