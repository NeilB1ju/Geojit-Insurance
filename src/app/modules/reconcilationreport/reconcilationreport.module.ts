import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import {
  reconcilationreportComponent,
  TableFilterPipe,
} from "./reconcilationreport.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";

@NgModule({
  imports: [SharedModule, PolicyDetailsModule],
  declarations: [reconcilationreportComponent, TableFilterPipe],
  providers: [],
  bootstrap: [reconcilationreportComponent],
})
export class reconcilationreportModule {}
