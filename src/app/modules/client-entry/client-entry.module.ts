 import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import {ClientEntryComponent } from "./client-entry.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ClientEntryComponent,
    
  ],
  providers: [
  ],
  entryComponents: [
  
  ],
  bootstrap: [ClientEntryComponent],
})

export class cliententryModule { }
