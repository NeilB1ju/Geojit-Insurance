import { NgModule } from "@angular/core";

import { SharedModule } from "shared";
import { ExceptionReportComponent } from "./ExceptionReport.component";

@NgModule({
  imports: [SharedModule],
  declarations: [ExceptionReportComponent],
  providers: [],
  bootstrap: [ExceptionReportComponent],
})
export class ExceptionReportModule {}
