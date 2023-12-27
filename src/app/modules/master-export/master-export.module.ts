import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { MasterExportComponent } from "./master-export.component";

@NgModule({
  imports: [SharedModule],
  declarations: [MasterExportComponent],
  providers: [],
  bootstrap: [MasterExportComponent],
})
export class MasterExportModule {}
