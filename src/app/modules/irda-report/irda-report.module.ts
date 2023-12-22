import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { NzFormModule } from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';
import { IrdaReportComponent } from './irda-report.component';




@NgModule({
  declarations: [IrdaReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NzFormModule
   
  ],
  bootstrap: [IrdaReportComponent],
})
export class IRDAReportModule { }
