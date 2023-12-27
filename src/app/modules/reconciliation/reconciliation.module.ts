import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { ReconciliationComponent } from "./reconciliation.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
      ReconciliationComponent,
  ],
  providers: [
  ],
  bootstrap: [ReconciliationComponent],
})

export class ReconciliationModule { }
