import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditReportComponent } from './audit-report.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [AuditReportComponent],
  imports: [
    CommonModule,SharedModule
  ],
  bootstrap: [AuditReportComponent],
})
export class AuditReportModule { }
