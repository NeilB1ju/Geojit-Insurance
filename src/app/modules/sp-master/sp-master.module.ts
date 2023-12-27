import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { SpMaster } from "./sp-master.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SpMaster,
  ],
  providers: [
  ],
  bootstrap: [SpMaster],
})

export class SpMasterModule { }
