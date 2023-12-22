import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLocationTransferReportComponent } from './client-location-transfer-report.component';
import { SharedModule } from 'shared';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ClientLocationTransferReportComponent],
  imports: [
    CommonModule,SharedModule,ReactiveFormsModule
  ],
  bootstrap: [ClientLocationTransferReportComponent]
})
export class ClientLocationTransferReportModule { }
