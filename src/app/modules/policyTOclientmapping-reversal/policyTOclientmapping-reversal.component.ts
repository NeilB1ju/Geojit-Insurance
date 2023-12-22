import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { FindType } from 'shared'
import { FindOptions } from 'shared';
import * as  jsonxml from 'jsontoxml';
import { FormHandlerComponent } from 'shared';
import { AppConfig } from 'shared';
import { InputMasks } from 'shared';
import * as moment from 'moment';
import { ValidationService } from 'shared';
import * as FileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd';
import {trigger,state,animate,transition,style, useAnimation } from "@angular/animations";
import { zoomIn } from 'ng-animate';


export interface policyTOclientmappingreversalForm {
  clientid: any;
  Client: any;
  Location: any;
  PAN: any;
  Mobile: any;
  Email: any;
  Address: any;
  City: any;
  Name: any;
  pdtCategory: any;
  Policyno: any;
  ProductCodeorName: any;
  InsurerType: string;
  insCompany: AnalyserOptions;
  fromDate: Date;
  toDate: Date;
  LorE: any;
  IorB: any;



}

@Component({
  selector: 'app-policyTOclientmapping-reversal',
  templateUrl: './policyTOclientmapping-reversal.component.html',
  styleUrls: ['./policyTOclientmapping-reversal.component.less'],

  animations: [
    trigger("slideInOutup", [
      // state("true", style({ height: "0px" })),// by ishaq expansion and shrinking
      state("true", style({ display: "none" })),
      // state("false", style({ display: "block" })),
      transition("* => *", animate("0ms linear"))
    ])

    //     trigger("slideInOutup", [transition(':enter', useAnimation(zoomIn, {
    //   params: { timing: 1, delay: 0 }
    // }))])

  ]

})
export class policyTOclientmappingreversalComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;


  model: policyTOclientmappingreversalForm;
  reconProcessList: Array<any> = [];
  insCompList: Array<any> = [];
  currentUser: User;
  FormControlNames: {} = {};
  completedProcess;
  locationFindopt: FindOptions;
  clientFindopt: FindOptions;
  Insuertype: any[];
  product: any[];
  tablelist: any = [];
  CName: boolean = true;
  CLocation: boolean = true;
  CCity: boolean = true;
  CAddress: boolean = true;
  CEmail: boolean = true;
  CMobileC: boolean = true;
  CPAN: boolean = true;
  Findlist: any = [];
  html: string;
  isProcessing: boolean;
  Records: any[];
  isSpinning:boolean =false

  Columns: any;
  policyNumber: any;
  showLeftSide:boolean =true
  Next: any =0;
  isVisible: boolean=false;
  pendinglist: any;
  Head: any;
  Client: any=[];
  checkbox:boolean
  arrey: any=[];
  XMLDATA: any;
  




  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private modalService: NzModalService,
    private validServ: ValidationService,
    private notif: NzNotificationService) {
    this.model = <policyTOclientmappingreversalForm>{};
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.clientFindopt = {
      findType: 1021,
      codeColumn: 'ClientID',
      codeLabel: 'ClientFirstName',
      descColumn: 'ClientFirstName',
      descLabel: 'ClientFirstName',
      requestId: 2

    }
  }

  ngOnInit() {
    this.model.Client='';
  //  this.getclient();

  }


  getclient() {
    this.isSpinning=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          status :'N',
          ClientId :''
      
        }],
      "requestId": "82"
    }).then((response) => {
      debugger

      this.isSpinning=false

      let res;
      if (response && response[0]) {
        this.Client = this.utilServ.convertToObject(response[0]);
        this.model.Client = this.Client[0].Code;
      } else {

      }
    });

    this.tablelist = []
  }

  getpolicylist() {
    debugger
    if(!this.model.Client)
    {
      this.tablelist=[]
      return;
    }
    this.isSpinning=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          status :'Y',
          ClientId :this.model.clientid?this.model.clientid:''
      
        }],
      "requestId": "82"
    }).then((response) => {
      debugger
      this.isSpinning=false
      let res;
      if (response && response[0]) {
        this.tablelist = this.utilServ.convertToObject(response[0]);
        
      } else {

      }
    });

   
  }
  reverse()
  {debugger
    this.XMLDATA=null
      for(let i=0;i<this.tablelist.length;i++)
      {
        if(this.tablelist[i].checkbox)
          {
          
          this.arrey.push(this.tablelist[i])
          }

      }
      if(this.arrey.length)
      {
        var JSONData = this.utilServ.setJSONArray(this.arrey);
         this.XMLDATA = jsonxml(JSONData);
        this.XMLDATA = this.XMLDATA.replace(/&/gi, '#||')
      }
      else
      {
        this.notif.error('Select atleast one data','')
        return;
      }
    
      this.isSpinning=true
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            Euser: this.currentUser.userCode,
            XML:this.XMLDATA?this.XMLDATA:'',
            ClientId:this.model.Client?this.model.Client.ClientID:''
        
          }],
        "requestId": "83"
      }).then((response) => {
        debugger
        this.isSpinning=false
        let res;
        if (response && response.errorCode == 0) {
          this.notif.success('Success','')
          this.ngOnInit()
          this.tablelist=[]
          this.arrey=[]
        } else {

          this.notif.error('Error','')
  
        }
      });


  }
  onSelectClient(data) {
     
    if (data) {
     
       this.model.clientid=data.ClientID;
      this. getpolicylist()
    }
  }
 

}
