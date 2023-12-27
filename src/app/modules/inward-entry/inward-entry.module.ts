import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { InwardEntryComponent } from "./inward-entry.component";

@NgModule({
  imports: [SharedModule],
  declarations: [InwardEntryComponent],
  providers: [],
  bootstrap: [InwardEntryComponent],
})
export class InwardEntryModule {}
