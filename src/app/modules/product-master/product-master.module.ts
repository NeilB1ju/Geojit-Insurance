import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { ProductMaster } from "./product-master.component";


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ProductMaster,
  ],
  providers: [
  ],
  bootstrap: [ProductMaster],
})

export class ProductMasterModule { }


