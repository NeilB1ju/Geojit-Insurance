import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeReportComponent } from './income-report.component';
import { SharedModule } from 'shared';
@NgModule({
  declarations: [IncomeReportComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [IncomeReportComponent],
})
export class IncomeReportModule { }
