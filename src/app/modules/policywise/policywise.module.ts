import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { policywise } from "./policywise.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    policywise,
  ],
  providers: [
  ],
  bootstrap: [policywise],
})

export class policywiseModule { }
