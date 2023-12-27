import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { SplicenseExpiryrptComponent } from "./splicense-expiryrpt.component";

@NgModule({
  imports: [SharedModule],
  declarations: [SplicenseExpiryrptComponent],
  providers: [],
  bootstrap: [SplicenseExpiryrptComponent],
})
export class SplicenseExpiryrptModule {}
