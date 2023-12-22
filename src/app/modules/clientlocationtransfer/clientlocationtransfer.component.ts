import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { FindType } from "shared";
import { FindOptions } from "shared";



import { FormHandlerComponent } from 'shared';



export interface clientlocationtransferForm {
  Reason: string ;

  fromLocation: any;
  toLocation: any;
  client: any;


}

@Component({
  templateUrl: './clientlocationtransfer.component.html',
  styleUrls: ['./clientlocationtransfer.component.less'],





})

export class clientlocationtransferComponent implements OnInit {



  fromLocationFindopt: FindOptions;
  toLocationFindopt: FindOptions;
  clientFindopt: FindOptions;





  model: clientlocationtransferForm;
  // @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;
  // @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;


  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  dateFormat = 'dd/MM/yyyy';
  locationcode: any;
  isselectclient: boolean;


  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private notification: NzNotificationService,
    private _DomSanitizationService: DomSanitizer,
  ) {
    this.model = <clientlocationtransferForm>{


    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });


    // codeColumn: 'Location',
    // codeLabel: 'LocationCode',
    // descColumn: 'LocationName',
    // descLabel: 'Location',
    // title:'LocationName',

    this.fromLocationFindopt = {
      findType: FindType.Location,
      codeColumn: 'LocationName',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title: 'Location',
      hasDescInput: false,
      requestId:2

    }
    this.toLocationFindopt = {
      findType: FindType.Location,
      codeColumn: 'LocationName',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title: 'Location',
      hasDescInput: false,
      requestId:2
      // whereClause: "Location<>'AAA'"

    }
    this.clientFindopt = {
      findType: FindType.Client,
      codeColumn: 'ClientFirstName',
      codeLabel: 'Client Id',
      descColumn: 'ClientFirstName',
      descLabel: 'Name',
      title: 'Client',
      hasDescInput: false,
      requestId:2
    }


  }

  ngOnInit() {

    // this.formHandler.config.isModifyState = false;
    this.model.fromLocation = "";
    this.model.toLocation = "";
    this.model.client = "";

  }


  Reset() {
    this.ngOnInit();
  }


  transferLocation() {
debugger
   
    if (this.model.Reason == '' || this.model.Reason == null || this.model.Reason == undefined) {
      this.notification.error('Reason Field should be filled', '');
      return;
    }
    if (this.model.toLocation.Location == this.model.fromLocation.Location) {
      this.notification.warning('Client already in this location', '');
      return;
    }

    if (!this.model.client) {
      this.notification.error('Please select client', '');
      return;
    }
    if (!this.model.fromLocation) {
      this.notification.error('Please select From location', '');
      return;
    }
    if (!this.model.toLocation) {
      this.notification.error('Please select To location', '');
      return;
    }
    if (this.model.fromLocation==this.model.toLocation) {
      this.notification.error('From location and To location cant be same', '');
      return;
    }
    debugger
    this.dataServ.getResultArray({
      "FileImport": "false",
      "batchStatus": "false",
      "detailArray": [{
        ClientID: this.model.client.ClientID,
        FromLocation: this.model.fromLocation.Location,
        ToLocation: this.model.toLocation.Location,
        Euser: this.currentUser.userCode || '',
        Reason:this.model.Reason
      }],
      "requestId": "32",
    }).then((response) => {

      if (response && response.errorMsg ) {
        this.notification.error('error', response.errorMsg);
        return;
      }
      if (response && response.results) {
        {
          this.notification.success('Location transfered successfully', '');
        }
        this.Reset();

      }
    })
      .catch(function (error) {
      });
  }
  // onChangeLocation(data) {debugger
  //   this.toLocationFindopt = {
  //     findType: FindType.Location,
  //     codeColumn: 'LocationName',
  //     codeLabel: 'LocationCode',
  //     descColumn: 'LocationName',
  //     descLabel: 'Location',
  //     title: 'Location',
  //     whereClause: "Location <>'" + data.Location + "'"


  //   }
  // }
  onChangeclient(data)
  {
    if(data && data.ClientID)
    {
console.log(data)
this.locationcode = ''
this.isselectclient = false
this.model.fromLocation =[];
this.model.toLocation =[];
this.model.Reason ='';
this.dataServ.getResponse({
  "batchStatus": "false",
  "detailArray":
    [{
      clientid :data.ClientID,
      Euser : this.currentUser.userCode

    }],
  "requestId": "100"
}).then((response) => {debugger

  let res;
  if (response && response[0]) {
  let datetype = this.utilServ.convertToObject(response[0]);
  this.model.fromLocation =datetype[0]

  debugger
  if(this.model.fromLocation != '' || this.model.fromLocation != [] || this.model.fromLocation != null)
  {
    this.isselectclient = true
  }

  } else {

  }
});
    }
  }
test()
{debugger
  this.model.fromLocation
}

  }

















