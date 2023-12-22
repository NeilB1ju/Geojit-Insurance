import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GstInvoiceGenerationComponent } from './gst-invoice-generation.component';
import {SharedModule} from 'shared'
@NgModule({
  declarations: [GstInvoiceGenerationComponent],
  imports: [
    CommonModule,SharedModule
  ],
  bootstrap:[GstInvoiceGenerationComponent]
})
export class GstInvoiceModule { }
