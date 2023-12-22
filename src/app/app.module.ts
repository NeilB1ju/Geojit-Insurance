import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootModule } from "shared";
import { DefaultLayoutComponent } from "shared";
import { AuthComponent } from "shared";
import { AuthGuard } from "shared";

import { RootComponent } from 'shared';
import { DefaultConfig } from 'shared/lib/models/default-config';
import { environment } from '../environments/environment';
import { WorkspaceEnum } from "./constants/workspace.enum";
// import { ExcelExportModule } from '@progress/kendo-angular-excel-export';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: DefaultLayoutComponent,
    // loadChildren: 'app/layout/default/default.module#DefaultLayoutModule',
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  }

];

const defaultConfig: DefaultConfig = {
  auth_app_url: environment.auth_app_url,
  api_base_url: environment.api_base_url,
  api_xlrds_url: environment.api_xlrds_url,
  app_version:environment.app_version,
  default_db: 'db1',
  project_id: 1000,
}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    // ExcelExportModule,
    RootModule.forRoot(defaultConfig, WorkspaceEnum),
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
