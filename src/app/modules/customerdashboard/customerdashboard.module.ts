import { NgModule } from '@angular/core';

import { SharedModule } from "shared";

import { customerdashboard } from "./customerdashboard.component";
import { PolicyDetailsModule } from "../../modules/policy-details/policy-details.module";

@NgModule({
  imports: [
    SharedModule,
    PolicyDetailsModule,
  ],
  declarations: [
    customerdashboard,
  ],
  providers: [
  ],
  bootstrap: [customerdashboard],
})

export class customerdashboardModule { }
