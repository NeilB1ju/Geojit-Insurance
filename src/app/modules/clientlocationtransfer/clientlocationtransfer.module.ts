import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { clientlocationtransferComponent } from "./clientlocationtransfer.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    clientlocationtransferComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [clientlocationtransferComponent],
})

export class clientlocationtransferModule { }
