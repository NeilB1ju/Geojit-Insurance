import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { clientmergingComponent } from "./clientmerging.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    clientmergingComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [clientmergingComponent],
})

export class clientmergingModule {}
