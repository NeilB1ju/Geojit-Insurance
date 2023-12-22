 import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import {PolicystatusmappingComponent } from "./Policystatusmapping.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    PolicystatusmappingComponent,
    
  ],
  providers: [
  ],
  entryComponents: [
  
  ],
  bootstrap: [PolicystatusmappingComponent],
})

export class PolicystatusmappingModule { }
