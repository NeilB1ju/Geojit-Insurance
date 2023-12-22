import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";

@NgModule({
  imports: [
    SharedModule,
    
    
  ],
  declarations: [
    PolicyDetailsComponent
  ],
  exports:[
    PolicyDetailsComponent
  ],
  providers: [
  ],
  entryComponents: [
    PolicyDetailsComponent
  ],

})

export class PolicyDetailsModule { }
