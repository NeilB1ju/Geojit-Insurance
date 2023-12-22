import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { policyTOclientmappingreversalComponent } from "./policyTOclientmapping-reversal.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    policyTOclientmappingreversalComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [policyTOclientmappingreversalComponent],
})

export class policyTOclientmappingreversalModule { }
