import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { policyTOclientmappingComponent } from "./policyTOclientmapping.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    policyTOclientmappingComponent,
  ],
  providers: [
  ],
  bootstrap: [policyTOclientmappingComponent],
})

export class policyTOclientmappingModule { }
