
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
import { Policystatusmapping } from './Policystatusmapping';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { InputMasks } from 'shared';
import { InputPatterns } from 'shared';
import { ValidationService } from 'shared';
import * as FileSaver from 'file-saver';

import { User } from 'shared/lib/models/user';
@Component({
  selector: 'app-Policystatusmapping',
  templateUrl: './Policystatusmapping.component.html',
  styleUrls: ['./Policystatusmapping.component.less']
})
export class PolicystatusmappingComponent implements OnInit {
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
  model: Policystatusmapping = new Policystatusmapping();
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
  Companylist: any[];
  Policystatuslist: any[];
  yORn:any
  PrevSummid:any
  html: string;
  Records: Array<any> = [];
  Columns: Array<any> = [];
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
    this.formHandler.config.showExportExcelBtn = true;
    this.getproducttype()
    this.yORn='Y'
    // this.getmartialStatusList();

  }
  getInsuranceCompany(){
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
         EUser:this.currentUser.userCode,
         Producttype:this.model.ProductType?this.model.ProductType:0
        }],
      "requestId": "136",
      "outTblCount": "0"
    })
      .then((response) => {debugger
        if (response && response[0].rows.length > 0) {
        
          this.Companylist=this.utilServ.convertToObject(response[0]);
      
        } else if (response.errorMsg) {

        }
      });
  }

  getproducttype()
  {

      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
           EUser:this.currentUser.userCode
          }],
        "requestId": "134",
        "outTblCount": "0"
      })
        .then((response) => {debugger
          if (response && response[0].rows.length > 0) {
            this.Producttytpe = this.utilServ.convertToObject(response[0]);
          //  this.Producttytpe = [...this.Producttytpe];
            this.Companylist=this.utilServ.convertToObject(response[1]);
            this.Policystatuslist=this.utilServ.convertToObject(response[2]);
          } else if (response.errorMsg) {
  
          }
        });
  
    
  }

Save()
{


  if(this.model.Code=='' || this.model.Code==null || this.model.Code==undefined )
  {
    this.notification.error('Policy Code is required','')

    return;

  }
  
  if(this.model.Description=='' || this.model.Description==null || this.model.Description==undefined )
  {
    this.notification.error('Policy Description is required','')

    return;

  }
  
  
  
  if(this.model.ProductType ==0 || this.model.ProductType==null || this.model.ProductType==undefined )
  {
    this.notification.error('Product Type is required','')

    return;

  }
  
  if(this.model.CompanyID==0 || this.model.CompanyID==null || this.model.CompanyID==undefined )
  {
    this.notification.error('Company is required','')

    return;

  }
  
  if(this.model.Policystatus=='' || this.model.Policystatus==null || this.model.Policystatus==undefined )
  {
    this.notification.error('Policy Status is required','')

    return;

  }
  
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        PolicyId: this.model.PolicyId,
        Policycode:  this.model.Code, 
        PolicyDes : this.model.Description   ,
        ProductTypeId :this.model.ProductType,      
        Companyid:  this.model.CompanyID? this.model.CompanyID:0,                                                                          
        Policystatusid:      this.model.Policystatus,
        Commissionenabled:      this.yORn  , 
        PrevSummID:this.PrevSummid?this.PrevSummid:0 ,                                                                                      
        EUser     :  this.currentUser.userCode,
        Export  :0
      }],
    "requestId": "135",
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
  this.resetForm()
      }
      else
      {
  this.notification.error(response.errorMsg,'')
      }
      
    });

  
}
// export() {
//   debugger
 
//  this.isSpinning=true
//  let reqParams = {
//    "batchStatus": "false",
//    "detailArray":
//    [{
//     PolicyId: 0,
//     Policycode:  this.model.Code?this.model.Code:'', 
//     PolicyDes : this.model.Description ? this.model.Description:''  ,
//     ProductTypeId :this.model.ProductType?this.model.ProductType:0,      
//     Companyid:  this.model.CompanyID? this.model.CompanyID:0,                                                                          
//     Policystatusid:      this.model.Policystatus?this.model.Policystatus:0,
//     Commissionenabled:      this.yORn  , 
//     PrevSummID:this.PrevSummid?this.PrevSummid:0 ,                                                                                      
//     EUser     :  this.currentUser.userCode,
//     Export  :1
//    }],
//    "requestId": "135",
//    "outTblCount": "0"
//  }
//  reqParams['fileType'] = "2";
//  reqParams['fileOptions'] = { 'pageSize': 'A4' };
//  let isPreview: boolean;
//  isPreview = false;

//  this.dataServ.generateReportmultiexcel(reqParams, isPreview).then((response) => { debugger
//    this.isSpinning=false
//    // this.isSpinning = false;
//    if (response.errorMsg) {
//      this.notification.error("Data not found", '')
//    }
   
// },() => {
//  debugger
//  this.notification.error("Server Encountered an Error", '')
// }
// );
// }
export(){
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        PolicyId: 0,
        Policycode:  this.model.Code? this.model.Code:'', 
        PolicyDes : this.model.Description ?this.model.Description:''  ,
        ProductTypeId :this.model.ProductType?this.model.ProductType:0,      
        Companyid:  this.model.CompanyID? this.model.CompanyID:0,                                                                          
        Policystatusid: 0,
        Commissionenabled:      this.yORn  , 
        PrevSummID:this.PrevSummid?this.PrevSummid:0 ,                                                                                      
        EUser     :  this.currentUser.userCode,
        Export  :1
      }],
    "requestId": "135",
    "outTblCount": "0"
  })
    .then((response) => {debugger
      if (response && response[0]) {
        this.Records = this.utilServ.convertToResultArray(response[0]);
        this.Columns = response[0].metadata.columns;
        this.Excel(this.Columns, this.Records, '')
      }
     
      else
      {
      this.notification.error('Failed to Export','')
      }
      
    });

}
// export to excel
Excel(colums, data, filename) {
  let tableHeader;
  this.html = "<table><tr>";
  tableHeader = colums;
  for (let i = 0; i < tableHeader.length; i++) {
    this.html = this.html + "<th>" + tableHeader[i] + "</th>";
  }
  this.html = this.html + "</tr><tr>";
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < tableHeader.length; j++) {
      this.html = this.html + "<td>" + data[i][tableHeader[j]] + "</td>";
    }
    this.html = this.html + "<tr>";
  }
  this.html = this.html + "</tr><table>";
  

  let blob = new Blob([this.html],{
    type: "application/vnd.ms-excel;charset=charset=utf-8"
    
  }
  
  );debugger
  
  FileSaver.saveAs(blob,"PolicyStatusMapping.xls");
}

  resetForm() {

    this.formHandlerRight = true;
    this.formHandler.config.showModifyBtn = false;
    this.formHandler.config.isModifyState = false;
    this.modifyform = true
    this.formHandler.config.showSaveBtn = true;
    this.isModifyState = false;

    this.model.Code='';
    this.model.Description='';
    this.model.ProductType = null;
    this.model.CompanyID = null;
    this.model.Policystatus = null;
    this.yORn='Y'
    this.model.PolicyId=0
    this.PrevSummid=0
    this.getproducttype()
  }

  Search() {
     
    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 1022, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }


    this.lookupsearch.actionOpen(reqParams, 'Policy Status');
    
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
    debugger
    this.model.Code=data.PolicyCode
    this.model.Description=data.PolicyDescription
    this.model.ProductType = data.ProductTypeId
    this.model.CompanyID = data.COMPANYID
    this.model.Policystatus = data.POLICYSUMMARYID
    this.yORn=data.COMMISSIONENABLED
    this.model.PolicyId=data.id
    this.PrevSummid=data.POLICYSUMMARYID
    // this.model.CompanyID = data.InsCompanyID;
    // this.getCompanydetails();
    this.isModifyState = true
    this.formHandler.config.showModifyBtn = true;
    this.formHandler.config.isModifyState = false;
    this.formHandler.config.showSaveBtn = false;


  }

 

  modify() {
     
    this.modifyform = true
    this.formHandler.config.showModifyBtn = false;

    this.formHandler.config.isModifyState = true;
    this.formHandler.config.showSaveBtn = true;
    this.isModifyState = true
  }



 
  


  


}
