import { NgModule } from '@angular/core';

import { SharedModule } from "shared";
import { TransactionFileUploadComponent } from "./transaction-fileupload.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
      TransactionFileUploadComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [TransactionFileUploadComponent],
})

export class TransactionFileUploadModule { }
