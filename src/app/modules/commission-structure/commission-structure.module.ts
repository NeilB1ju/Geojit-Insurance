import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { CommissionStructureComponent } from "./commission-structure.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    CommissionStructureComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [CommissionStructureComponent],
})

export class CommissionStructureModule { }
