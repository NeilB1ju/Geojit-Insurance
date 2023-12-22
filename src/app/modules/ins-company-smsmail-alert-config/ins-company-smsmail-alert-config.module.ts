import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsCompanySMSMailAlertConfigComponent } from './ins-company-smsmail-alert-config.component';
import { SharedModule } from 'shared';


@NgModule({
  declarations: [InsCompanySMSMailAlertConfigComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [InsCompanySMSMailAlertConfigComponent],
})
export class InsCompanySMSMailAlertConfigModule { }
