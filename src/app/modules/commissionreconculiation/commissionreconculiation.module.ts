import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import {
  commissionreconculiationComponent,
  TableFilterPipe,
} from "./commissionreconculiation.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";
import { policywithlocationModule } from "../policywithlocation/policywithlocation.module";

@NgModule({
  imports: [SharedModule, PolicyDetailsModule, policywithlocationModule],
  declarations: [commissionreconculiationComponent, TableFilterPipe],
  providers: [],
  bootstrap: [commissionreconculiationComponent],
})
export class commissionreconculiationModule {}
