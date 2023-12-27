import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { SlabMasterComponent } from "./slab-master.component";

@NgModule({
  imports: [SharedModule],
  declarations: [SlabMasterComponent],
  providers: [],
  bootstrap: [SlabMasterComponent],
})
export class SlabMasterModule {}
