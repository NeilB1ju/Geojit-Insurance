import { NgModule } from '@angular/core';
import { SharedModule } from 'shared';
import { FTMReportComponent } from './ftm-report.component';
//  import { ExcelExportModule } from '@progress/kendo-angular-excel-export';


@NgModule({
 
  imports: [
    SharedModule
    // ,ExcelExportModule
  ],
  declarations: [
    FTMReportComponent
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [FTMReportComponent],
})
export class FTMReportModule { }
