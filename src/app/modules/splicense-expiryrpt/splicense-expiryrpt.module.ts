import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { SplicenseExpiryrptComponent } from "./splicense-expiryrpt.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
      SplicenseExpiryrptComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [SplicenseExpiryrptComponent],
})

export class SplicenseExpiryrptModule { }
