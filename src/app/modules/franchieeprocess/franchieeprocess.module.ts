import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { franchieeprocessComponent,TableFilterPipe } from "./franchieeprocess.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";

@NgModule({
  imports: [
    SharedModule,    
    PolicyDetailsModule,
  ],
  declarations: [
    franchieeprocessComponent,
       TableFilterPipe
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [franchieeprocessComponent],
})

export class franchieeprocessModule { }
