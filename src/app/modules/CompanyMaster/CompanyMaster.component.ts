
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { UtilService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CompanyMaster } from './CompanyMaster';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { InputMasks } from 'shared';
import { InputPatterns } from 'shared';
import { ValidationService } from 'shared';

import { User } from 'shared/lib/models/user';
@Component({
  selector: 'app-CompanyMaster',
  templateUrl: './CompanyMaster.component.html',
  styleUrls: ['./CompanyMaster.component.less']
})
export class CompanyMasterComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;
  currentUser: User;
  dateFormat = 'dd/MM/yyyy';
  Relationlist: Array<any> = [];
  RiskAptitudelist: Array<any> = [];
  Genderlist: Array<any> = [];
  MaritalStatuslist: Array<any> = [];
  Educationlist: Array<any> = [];
  Networthlist: Array<any> = [];
  Occupationlist: Array<any> = [];
  rpttype: Array<any> = [];
  incomelist: Array<any> = [];
  model: CompanyMaster = new CompanyMaster();
  statelist: Array<any> = [];
  locationFindopt: FindOptions;
  comcountyFindopt: FindOptions;
  clientFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  ProductFindopt: FindOptions;
  location: any;
  isVisible: any;
  branchcode: any;
  date = new Date();
  todaydate: any = new Date();
  isModifyState: boolean;
  formHandlerRight: boolean = false;
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;
  FormControlNames: {} = {};
  modifybtn: boolean;
  isSpinning: boolean = false;

  modifyform: boolean = true;
  isPanValid: boolean = false;
  PanDetails: any;
  isholder1Pan: boolean;
  hold1VarifiedPanDetails: any;
  checked: boolean;
  clientid: any;
  country: any[];
  frlocation: any[];
  franch: boolean = false;
  upperstring: string;
  Producttytpe: any[];
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private validServ: ValidationService,

  ) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );
  }

  ngOnInit() {

    this.model.CompanyID = 0;
    this.isModifyState = false;
    // this.formHdlr.setFormType('default');
    this.formHandler.config.isModifyState = false;
    this.formHandler.setFormType('default');
    this.formHandlerRight = true;
    this.formHandler.config.showModifyBtn = false;
    this.formHandler.config.showDeleteBtn = false;
    this.getproducttype()
    // this.getmartialStatusList();

  }


  getproducttype()
  {

      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
           EUser:this.currentUser.userCode
          }],
        "requestId": "75",
        "outTblCount": "0"
      })
        .then((response) => {
          if (response && response[0].rows.length > 0) {
            this.Producttytpe = this.utilServ.convertToObject(response[0]);
            this.Producttytpe = [...this.Producttytpe];
          } else if (response.errorMsg) {
  
          }
        });
  
    
  }

Save()
{


  if(this.model.Code=='' || this.model.Code==null || this.model.Code==undefined )
  {
    this.notification.error('Company Code is required','')

    return;

  }
  
  if(this.model.Description=='' || this.model.Description==null || this.model.Description==undefined )
  {
    this.notification.error('Company Description is required','')

    return;

  }
  
  if(this.model.Phone=='' || this.model.Phone==null || this.model.Phone==undefined )
  {
    this.notification.error('Company Phone is required','')

    return;

  }
  
  if(this.model.ProductType ==0 || this.model.ProductType==null || this.model.ProductType==undefined )
  {
    this.notification.error('Product Type is required','')

    return;

  }
  
  if(this.model.Email=='' || this.model.Email==null || this.model.Email==undefined )
  {
    this.notification.error('Company Email is required','')

    return;

  }
  
  if(this.model.Fax=='' || this.model.Fax==null || this.model.Fax==undefined )
  {
    this.notification.error('Company Fax is required','')

    return;

  }
  
  if(this.model.Bank=='' || this.model.Bank==null || this.model.Bank==undefined )
  {
    this.notification.error('Company Bank is required','')

    return;

  }
  
  if(this.model.Address1=='' || this.model.Address1==null || this.model.Address1==undefined )
  {
    this.notification.error('Company Address is required','')

    return;

  }
  
  if(this.model.Pin=='' || this.model.Pin==null || this.model.Pin==undefined )
  {
    this.notification.error('Company Pin is required','')

    return;

  }
  
  if(this.model.Afsm=='' || this.model.Afsm==null || this.model.Afsm==undefined )
  {
    this.notification.error('Company Afsm is required','')

    return;

  }
  
  if(this.model.Channel=='' || this.model.Channel==null || this.model.Channel==undefined )
  {
    this.notification.error('Company Channel Code is required','')

    return;

  }
  
  if(this.model.Source=='' || this.model.Source==null || this.model.Source==undefined )
  {
    this.notification.error('Company Source is required','')

    return;

  }


  
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Code:  this.model.Code,
        InsCompanyID:  this.model.CompanyID? this.model.CompanyID:0,
        Description : this.model.Description   ,                                                                                
        Phone:      this.model.Phone,
        Email:      this.model.Email ,                                                                                         
        Fax  :      this.model.Fax,                                                                                           
        Address1:   this.model.Address1,                                                                                            
        Address2 :  this.model.Address2,                                                                                           
        Address3 :  '' ,                                                                                         
        Pincode: this.model.Pin,
        ChannelCode : this.model.Channel,  
        AfsmCode : this.model.Afsm,
        Bank     :this.model.Bank,
        Source   :this.model.Source,
        EUser     :  this.currentUser.userCode,
        ProductType :this.model.ProductType,
        IorU : this.formHandler.config.isModifyState ? "U" : "I",
      }],
    "requestId": "76",
    "outTblCount": "0"
  })
    .then((response) => {debugger
      if(response && response.errorCode==0)
      {
  this.notification.success('Saved Successfully','')
  this.modifyform = false
  this.formHandler.config.showModifyBtn = true;
  this.formHandler.config.isModifyState = false;
  this.formHandler.config.showSaveBtn = false;
      }
      else
      {
  this.notification.error('Failed to save','')
      }
      
    });

  
}



  resetForm() {

    this.formHandlerRight = true;
    // this.formHandler.config.isModifyState = false;
    this.formHandler.config.showModifyBtn = false;
    this.formHandler.config.isModifyState = false;
    this.modifyform = true
    // this.formHandler.config.showModifyBtn = true;
    // this.formHandler.config.isModifyState = false;
    this.formHandler.config.showSaveBtn = true;


    //  this.model.Gender
    this.model.CompanyID = 0;
  
    this.isModifyState = false;
    this.model.Code='';
    this.model.Description='';
    this.model.Phone='';
    this.model.Email='';
    this.model.Fax='';
    this.model.Bank='';
    this.model.Address1='';
    this.model.Address2='';
    this.model.Pin='';
    this.model.Afsm='';
    this.model.Channel='';
    this.model.Source='';

    

  }

  Search() {
     
    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 1019, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }


    this.lookupsearch.actionOpen(reqParams, 'Company');
    
  }
  onLookupSelect(data) {
     

    if (this.formHandlerRight == true) {
      this.formHandler.config.isModifyState = true;

    }
    else {
      this.formHandler.config.isModifyState = false;
      this.formHandler.config.showSaveBtn = false;
      return;
    }
    this.modifyform = false;
    // if(this.formHandlerRight==true){
    //   this.formHdlr.config.isModifyState=true;
    //   this.isModifyState=true;
    // }
    // else{
    //   this.formHdlr.config.isModifyState=false;
    //   this.formHdlr.config.showSaveBtn=false;
    //   return;
    // }

    this.model.CompanyID = data.InsCompanyID;
    this.getCompanydetails();
    this.isModifyState = true
    this.formHandler.config.showModifyBtn = true;
    this.formHandler.config.isModifyState = false;
    this.formHandler.config.showSaveBtn = false;


  }

  getCompanydetails() {
     
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "CompanyID": this.model.CompanyID
        }],
      "requestId": "74",
      "outTblCount": "0"
    })
      .then((response) => {debugger
        let res1
        res1 = this.utilServ.convertToObject(response[0]);
        this.model.Code=res1[0].Code;
        this.model.Description=res1[0].Description;
        this.model.Phone=res1[0].Phone;
        this.model.Email=res1[0].Email;
        this.model.Fax=res1[0].Fax;
        this.model.Bank=res1[0].Bank;
        this.model.Address1=res1[0].Address1;
        this.model.Address2=res1[0].Address2;
        this.model.Pin=res1[0].Pincode;
        this.model.Afsm=res1[0].AfsmCode;
        this.model.Channel=res1[0].ChannelCode;
        this.model.Source=res1[0].Source;
        this.model.ProductType=res1[0].ProductTypeId

      });

   }


  modify() {
     
    this.modifyform = true
    this.formHandler.config.showModifyBtn = false;

    this.formHandler.config.isModifyState = true;
    this.formHandler.config.showSaveBtn = true;
    this.isModifyState = true
  }



 
  


  


}
