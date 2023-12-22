import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { policywithlocationComponent } from "../../modules/policywithlocation/policywithlocation.component";

@NgModule({
  imports: [
    SharedModule,
    
    
  ],
  declarations: [
    policywithlocationComponent
  ],
  exports:[
    policywithlocationComponent
  ],
  providers: [
  ],
  entryComponents: [
    policywithlocationComponent
  ],

})

export class policywithlocationModule { }
