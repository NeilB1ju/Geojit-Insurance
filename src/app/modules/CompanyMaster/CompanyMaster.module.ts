import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { CompanyMasterComponent } from "./CompanyMaster.component";

@NgModule({
  imports: [SharedModule],
  declarations: [CompanyMasterComponent],
  providers: [],
  bootstrap: [CompanyMasterComponent],
})
export class CompanyMasterModule {}
