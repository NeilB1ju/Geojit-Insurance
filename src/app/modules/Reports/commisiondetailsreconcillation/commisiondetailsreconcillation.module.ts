import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { CommisiondetailsreconcillationComponent } from "../commisiondetailsreconcillation/commisiondetailsreconcillation.component";

@NgModule({
  imports: [SharedModule],
  declarations: [CommisiondetailsreconcillationComponent],
  providers: [],
  bootstrap: [CommisiondetailsreconcillationComponent],
})
export class CommisiondetailsreconcillationModule {}
