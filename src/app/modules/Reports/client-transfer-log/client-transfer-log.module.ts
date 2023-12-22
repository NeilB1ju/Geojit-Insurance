import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientTransferLogComponent } from './client-transfer-log.component';
import { SharedModule } from 'shared';


@NgModule({
  declarations: [ClientTransferLogComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [ClientTransferLogComponent],
})
export class ClientTransferLogModule {
 
 
}
 
