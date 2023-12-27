import { NgModule } from "@angular/core";
import { SharedModule } from "shared";
import { DashboardComponent } from "./dashboard.component";
// import { CountUpModule } from 'countup.js-angular2';
import { ChartsModule } from "ng2-charts";
import { Chart } from "chart.js";

@NgModule({
  imports: [SharedModule, ChartsModule],
  declarations: [DashboardComponent],
  providers: [],
  bootstrap: [DashboardComponent],
})
export class DashboardModule {}
