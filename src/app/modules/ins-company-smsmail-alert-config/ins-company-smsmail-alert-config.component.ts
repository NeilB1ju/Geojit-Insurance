import { Component, OnInit, ViewChild } from '@angular/core';
import { FormHandlerComponent} from 'shared';
import { DataService,UtilService,AuthService} from 'shared';
import { User } from 'shared/lib/models/user';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { now } from 'moment';
import { InputMasks } from 'shared';
import * as moment from 'moment';
import { AppConfig } from 'shared';

@Component({
  selector: 'app-ins-company-smsmail-alert-config',
  templateUrl: './ins-company-smsmail-alert-config.component.html',
  styleUrls: ['./ins-company-smsmail-alert-config.component.less']
})

export class InsCompanySMSMailAlertConfigComponent implements OnInit {
  @ViewChild(FormHandlerComponent, { static: true }) formHdlr: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent, { static: false }) lookupsearch: LookUpDialogComponent;
  InsuranceType:any=[]
  currentUser: User
  Frequency:any=[]
  SMSMail:any[]
  BeforeorAfter:any
  Company:any=[]
  Insurance:any
  CompanyNg:any
  FrequencyNg:any
  SMSMailNg:any
  GracePeriod:any
  AlertDays:any
  valid:any
  saveType:any
  // ModifyFlag:boolean=false
  modifyForm:boolean=true
  IdNg:any=0
  PageLoad:any=[]
  DivLoad:any
  ShowLoadDiv:boolean=false
  ShowDtlDiv:boolean=false
  isVisibleModal:boolean=false
  MoreSelectarry:any=[]
  TemplateNg:any

  TemplateID:any=0
  AlertObjarry:any=[]

  ApprovedByNg:any
  ApprovedByNameNg:any
  ApprovedDateNg:any
  CheckedByNg:any
  CheckedByNameNg:any
  CheckedDateNg:any
  CreatedByNg:any
  CreatedByNameNg:any
  CreatedDateNg:any
  TemplateTabIndex:number=0
 
  TemplateIDMail:any=0

  MailTemplateNg:any;
  MailApprovedByNg:any;
  MailApprovedByNameNg:any
  MailApprovedDateNg:any;
  MailCheckedByNg:any;
  MailCheckedByNameNg:any
  MailCheckedDateNg:any;
  MailCreatedByNg:any;
  MailCreatedByNameNg:any
  MailCreatedDateNg:any;

  TemplateTabSmsorEmail:any
  SaveBtnFlag:boolean=false
  ModifyBtnFlag:boolean=false  
  ModifyUpdateBtnFlag:boolean=false
  TabDisable:boolean=false
  editArray:any
  inputMasks = InputMasks;
  DuplicateError:any

  constructor(
    private dataServ:DataService,
    private utilServ:UtilService,
    private modalService: NzModalService,
    private authServ:AuthService,
    private notification:NzNotificationService
   
  ) {
    this.authServ.getUser().subscribe(user => {
    this.currentUser = user;
    })
   }

  ngOnInit() {
    debugger
    this.BeforeorAfter='B'
   this.getInsuranceType()
   this.getFrequency()
   this.getSmsOrEmail()
   this.getInsCompany()
   this.formHdlr.config.showFindBtn = true;
   this.formHdlr.config.showSaveBtn = true;
   this.formHdlr.config.isModifyState = false;
   this.formHdlr.config.showPreviewBtn = true;

 
  this.PageLoadDetails()
  this.ShowLoadDiv=true
  this.DivLoad=1
  this.isVisibleModal=false
  }

getInsuranceType(){
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Euser: this.currentUser.userCode
      }],
    "requestId": "75",
    "outTblCount": "0"
  })
    .then((response) => {
      if (response && response[0].rows.length > 0) {
        this.InsuranceType = this.utilServ.convertToObject(response[0]);
        debugger
        // this.InsuranceType = [...this.InsuranceType];
        // this.InsuranceType=this.InsuranceType[0].Id
        this.getInsCompany()
      } else if (response.errorMsg) {

      }
    });
}
getFrequency(){
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Code:47
      }],
    "requestId": "4",
    "outTblCount": "0"
  })
    .then((response) => {
      debugger
      if (response && response[0].rows.length > 0) {
        this.Frequency = this.utilServ.convertToObject(response[0]);
        // this.Frequency = [...this.Frequency];
      } else if (response.errorMsg) {

      }
    });
}
getSmsOrEmail(){
 
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Code:46
      }],
    "requestId": "4",
    "outTblCount": "0"
  })
    .then((response) => {  
      
      if (response && response[0].rows.length > 0) {
        this.SMSMail = this.utilServ.convertToObject(response[0]);
       
      } else if (response.errorMsg) {

      }
    });
}
getInsCompany(){
  debugger
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Euser:this.currentUser.userCode,
        InsuerType:this.Insurance?this.Insurance:0
      }],
    "requestId": "139",
    "outTblCount": "0"
  })
    .then((response) => {  
      debugger  
      // this.InsuranceType.Id
      if (response && response[0].rows.length > 0) {
        this.Company = this.utilServ.convertToObject(response[0]);
        this.CompanyNg=this.Company[0].Code
        debugger
      } else if (response.errorMsg) {

      }
    });
}

Save(data){
  // this.saveType='I'
  debugger
this.valid=this.Validate()
if (this.valid){
  
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        id:                this.formHdlr.config.isModifyState ? this.IdNg : 0,
        InsuranceType:     this.Insurance,
        InsCompanyid:      this.CompanyNg,
        Frequency :        this.FrequencyNg,                                                                                
        GracePeriodDays:   this.GracePeriod,
        AlertType:         this.BeforeorAfter,                                                                                         
        AlertDays  :       this.AlertDays,                                                                                           
        SmsOrEmail:        this.SMSMailNg,                                                                                            
        Euser :            this.currentUser.userCode,                                                                                          
        IorU:              this.formHdlr.config.isModifyState ? "U" : "I",
        saveType:          data==1?'I':'S'
      }],
    "requestId": "106",
    "outTblCount": "0"
  })
    .then((response) => {debugger
      if(response && response.errorCode==0)
      {
  this.notification.success('Saved Successfully','')
  this.resetForm()
      }
      else if(response && response[0])
      {
        if(response[0].rows.length>0){
        this.DuplicateError=this.utilServ.convertToObject(response[0]);
            debugger
            if (this.DuplicateError[0].Temp1=='not all')
            {
            this.save1()
            }
            else
            {
          this.notification.error('Duplicate Entry Found for the Insurance Type','')
            }
        }
      }
        else{
        debugger
  this.notification.error('Failed to save! Duplicate entry Found','')
      }
      
    });

}
}


Validate(){
  debugger
 if (!this.Insurance){
   this.notification.error('Insurance Type is required','')
   return false
 }
 if (this.CompanyNg==null || this.CompanyNg==undefined){
  this.notification.error('Company Type is required','')
  return false
}
if (!this.FrequencyNg){
  this.notification.error('Frequency is required','')
  return false
}
if (!this.GracePeriod){
  this.notification.error('Grace Period is required','')
  return false
}
if (!this.AlertDays==null || this.AlertDays==undefined){
  this.notification.error('Alert Days is required','')
  return false
}
if (!this.SMSMailNg){
  this.notification.error('SMS or Mail is required','')
  return false
}
if(this.BeforeorAfter=='B' && this.AlertDays==0)
{
  this.notification.error('Alert Days is required','')
  return false
}
if(this.BeforeorAfter=='A' && this.AlertDays==0)
{
  this.notification.error('Alert Days is required','')
  return false
}
return true
}

resetForm(){
  this.Insurance=null
  this.CompanyNg=null
  this.FrequencyNg=null
  this.GracePeriod=''
  this.BeforeorAfter='B'
  this.AlertDays=''
  this.SMSMailNg=null
  // this.ngOnInit()
  this.modifyForm=true
  this.formHdlr.config.showFindBtn = true;
  this.formHdlr.config.showSaveBtn = true;
  this.formHdlr.config.isModifyState = false;
  this.formHdlr.config.showModifyBtn=false;
}

RadioChange(){
  debugger
  if (this.BeforeorAfter=='S'){
    this.AlertDays=0
  }
  else
  this.AlertDays=''
}
Search(){
  debugger

  let reqParams;

  reqParams = {
    "batchStatus": "false",
    "detailArray": [{ 
             "SearchType": 1024, 
             "LangId": 1 ,
             "WhereClause": ''
                   }],
    "myHashTable": {},
    "requestId": 2,
    "outTblCount": "0"
  }
  this.lookupsearch.actionOpen(reqParams, 'SMSorMail');
  debugger
}
onLookupSelect(data) {
     
debugger
  // if (this.formHandlerRight == true) {
    this.resetForm()
 
    this.formHdlr.config.showModifyBtn = true;
    this.formHdlr.config.showSaveBtn = false;
    this.modifyForm=false
debugger

this.Insurance=data.InsuranceType
this.CompanyNg=data.InsCompanyid
this.FrequencyNg=data.Frequency
this.GracePeriod=data.GracePeriodDays
this.BeforeorAfter=data.AlertType
this.AlertDays=data.AlertDays
this.SMSMailNg=data.SmsOrEmail
this.IdNg=data.id

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser:this.currentUser.userCode,
          InsuerType:this.Insurance?this.Insurance:0
        }],
      "requestId": "139",
      "outTblCount": "0"
    })
      .then((response) => {  
        debugger  
        // this.InsuranceType.Id
        if (response && response[0].rows.length > 0) {
          this.Company = this.utilServ.convertToObject(response[0]);
          // this.CompanyNg=this.Company[0].Code
          debugger
        } else if (response.errorMsg) {
  
        }
      });

    
}

modify(){
  debugger
// this.ModifyFlag=true
this.modifyForm=true
this.formHdlr.config.showModifyBtn = false;
this.formHdlr.config.isModifyState = true;
this.formHdlr.config.showSaveBtn = true;

}


save1()
{
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Duplicate Entry Found for a Company! Are you sure want to save?</b>',
      nzOnOk: () => this.Save(2)
    });
}

PageLoadDetails()
{
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        id:       0,
        EUser:    this.currentUser.userCode
      }],
    "requestId": "108",
    "outTblCount": "0"
  }).then((response) => {
    debugger

    if (response && response[0] && response[0].rows.length > 0) {
     this.PageLoad=this.utilServ.convertToObject(response[0]);
    //  this.PageLoad=response[0]
    //  debugger
    //  this.PageLoad
    }
    else {
      this.notification.error("No data Found", '')
    }

  })
}
DivLoadForm(obj){debugger
  this.PageLoadDetails()
  debugger
  this.DivLoad=obj
  if(this.DivLoad==1){
 this.ShowLoadDiv=true
  }
  else{
    this.ShowDtlDiv=true
  }
}

///////////////////////////
/*Edit(editobj)
{
  
 

  if(editobj.id)
  {
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        id:       editobj.id,
        EUser:    this.currentUser.userCode
      }],
    "requestId": "111",
    "outTblCount": "0"
  }).then((response) => {
    debugger

    if (response && response[0] && response[0].rows.length > 0) {
    this.editArray=this.utilServ.convertToObject(response[0]);


    this.Insurance=this.editArray[0].InsuranceType
    this.CompanyNg=this.editArray[0].InsCompanyid
    this.FrequencyNg=this.editArray[0].Frequency
    this.GracePeriod=this.editArray[0].GracePeriodDays
    this.BeforeorAfter=this.editArray[0].AlertType
    this.AlertDays=this.editArray[0].AlertDays
    this.SMSMailNg=this.editArray[0].SmsOrEmail
    this.IdNg=this.editArray[0].id
    
        this.dataServ.getResponse({
          "batchStatus": "false",
          "detailArray":
            [{
              Euser:this.currentUser.userCode,
              InsuerType:this.Insurance?this.Insurance:0
            }],
          "requestId": "139",
          "outTblCount": "0"
        })
          .then((response) => {  
            debugger  
            // this.InsuranceType.Id
            if (response && response[0].rows.length > 0) {
              this.Company = this.utilServ.convertToObject(response[0]);
              // this.CompanyNg=this.Company[0].Code
              debugger
            } else if (response.errorMsg) {
      
            }
          });

          this.resetForm()
          this.DivLoadForm(1)
          this.formHdlr.config.showModifyBtn = true;
          this.formHdlr.config.showSaveBtn = false;
          this.modifyForm=false
    }


    else {
      this.notification.error("No data Found", '')
    }

  })
}
}*/
////////////
modalLoad(obj){
 
  this.saveBtnFlag()
  this.TemplateTabIndex=0
  this.ModifyUpdateBtnFlag=false
  debugger
  this.isVisibleModal=true
  this.TemplateNg=""
  this.ApprovedByNg=""
  this.ApprovedByNameNg=""
  this.ApprovedDateNg=""
  this.CheckedByNg=""
  this.CheckedByNameNg=""
  this.CheckedDateNg=""
  this.CreatedByNg=""
  this.CreatedDateNg=""
  this.CreatedByNameNg=""
  this.MoreSelectarry=[]
  this.AlertObjarry=obj
  this.TemplateID= ""

  this.MailTemplateNg=""
  this.MailApprovedByNg=""
  this.MailApprovedByNameNg=""
  this.MailApprovedDateNg=""
  this.MailCheckedByNg=""
  this.MailCheckedByNameNg=""
  this.MailCheckedDateNg=""
  this.MailCreatedByNg=""
  this.MailCreatedByNameNg=""
  this.MailCreatedDateNg=""
  this.TemplateIDMail=""

  
  if(obj.id)
  {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          id:       obj.id,
          EUser:    this.currentUser.userCode
        }],
      "requestId": "109",
      "outTblCount": "0"
    })
      .then((response) => {  
        debugger  
        this.saveBtnFlag()

        if (response && response[0].rows.length > 0) {
          this.MoreSelectarry= this.utilServ.convertToObject(response[0]);
         
          debugger
          if (this.AlertObjarry.SmsorEmail=='S')
          {
          this.TemplateNg=this.MoreSelectarry[0].Template
          this.ApprovedByNg=this.MoreSelectarry[0].ApprovedBy
          this.ApprovedByNameNg=this.MoreSelectarry[0].ApprovedName
          this.ApprovedDateNg=this.MoreSelectarry[0].ApprovedDate
          this.CheckedByNg=this.MoreSelectarry[0].CheckedBy
          this.CheckedByNameNg=this.MoreSelectarry[0].CheckedName
          this.CheckedDateNg=this.MoreSelectarry[0].CheckedDate
          this.CreatedByNg=this.MoreSelectarry[0].CreatedBy
          this.CreatedByNameNg=this.MoreSelectarry[0].CreatedName
          this.CreatedDateNg=this.MoreSelectarry[0].CreatedDate
          this.TemplateID=this.MoreSelectarry[0].id
          }
          if (this.AlertObjarry.SmsorEmail=='M')
          {
          this.MailTemplateNg=this.MoreSelectarry[0].Template
          this.MailApprovedByNg=this.MoreSelectarry[0].ApprovedBy
          this.MailApprovedByNameNg=this.MoreSelectarry[0].ApprovedName
          this.MailApprovedDateNg=this.MoreSelectarry[0].ApprovedDate
          this.MailCheckedByNg=this.MoreSelectarry[0].CheckedBy
          this.MailCheckedByNameNg=this.MoreSelectarry[0].CheckedName
          this.MailCheckedDateNg=this.MoreSelectarry[0].CheckedDate
          this.MailCreatedByNg=this.MoreSelectarry[0].CreatedBy
          this.MailCreatedByNameNg=this.MoreSelectarry[0].CreatedName
          this.MailCreatedDateNg=this.MoreSelectarry[0].CreatedDate
          this.TemplateIDMail=this.MoreSelectarry[0].id
          }
          if (this.AlertObjarry.SmsorEmail=='B' && response[0].rows.length > 1)
          {
            
            this.MailTemplateNg=this.MoreSelectarry[0].Template
            this.MailApprovedByNg=this.MoreSelectarry[0].ApprovedBy
            this.MailApprovedByNameNg=this.MoreSelectarry[0].ApprovedName
            this.MailApprovedDateNg=this.MoreSelectarry[0].ApprovedDate
            this.MailCheckedByNg=this.MoreSelectarry[0].CheckedBy
            this.MailCheckedByNameNg=this.MoreSelectarry[0].CheckedName
            this.MailCheckedDateNg=this.MoreSelectarry[0].CheckedDate
            this.MailCreatedByNg=this.MoreSelectarry[0].CreatedBy
            this.MailCreatedByNameNg=this.MoreSelectarry[0].CreatedName
            this.MailCreatedDateNg=this.MoreSelectarry[0].CreatedDate
            this.TemplateIDMail=this.MoreSelectarry[0].id
            
            this.TemplateNg=this.MoreSelectarry[1].Template
            this.ApprovedByNg=this.MoreSelectarry[1].ApprovedBy
            this.ApprovedByNameNg=this.MoreSelectarry[1].ApprovedName
            this.ApprovedDateNg=this.MoreSelectarry[1].ApprovedDate
            this.CheckedByNg=this.MoreSelectarry[1].CheckedBy
            this.CheckedByNameNg=this.MoreSelectarry[1].CheckedName
            this.CheckedDateNg=this.MoreSelectarry[1].CheckedDate
            this.CreatedByNg=this.MoreSelectarry[1].CreatedBy
            this.CreatedByNameNg=this.MoreSelectarry[1].CreatedName
            this.CreatedDateNg=this.MoreSelectarry[1].CreatedDate
            this.TemplateID=this.MoreSelectarry[1].id
          }
          else if(this.AlertObjarry.SmsorEmail=='B' && response[0].rows.length ==1)
          {
            if (this.MoreSelectarry[0].SmsorEmailTab=='M')
            {
            this.MailTemplateNg=this.MoreSelectarry[0].Template
            this.MailApprovedByNg=this.MoreSelectarry[0].ApprovedBy
            this.MailApprovedByNameNg=this.MoreSelectarry[0].ApprovedName
            this.MailApprovedDateNg=this.MoreSelectarry[0].ApprovedDate
            this.MailCheckedByNg=this.MoreSelectarry[0].CheckedBy
            this.MailCheckedByNameNg=this.MoreSelectarry[0].CheckedName
            this.MailCheckedDateNg=this.MoreSelectarry[0].CheckedDate
            this.MailCreatedByNg=this.MoreSelectarry[0].CreatedBy
            this.MailCreatedByNameNg=this.MoreSelectarry[0].CreatedName
            this.MailCreatedDateNg=this.MoreSelectarry[0].CreatedDate
            this.TemplateIDMail=this.MoreSelectarry[0].id
            }
            else
            {
              this.TemplateNg=this.MoreSelectarry[0].Template
              this.ApprovedByNg=this.MoreSelectarry[0].ApprovedBy
              this.ApprovedByNameNg=this.MoreSelectarry[0].ApprovedName
              this.ApprovedDateNg=this.MoreSelectarry[0].ApprovedDate
              this.CheckedByNg=this.MoreSelectarry[0].CheckedBy
              this.CheckedByNameNg=this.MoreSelectarry[0].CheckedName
              this.CheckedDateNg=this.MoreSelectarry[0].CheckedDate
              this.CreatedByNg=this.MoreSelectarry[0].CreatedBy
              this.CreatedByNameNg=this.MoreSelectarry[0].CreatedName
              this.CreatedDateNg=this.MoreSelectarry[0].CreatedDate
              this.TemplateID=this.MoreSelectarry[0].id
            }
          }
          debugger
          this.saveBtnFlag()
          this.TemplateTabIndex=0
        } else if (response.errorMsg) {
  
        }
      });
     
  }

}
TemplateModify1()
{
  debugger
//this.ModifyBtnFlag=false
this.ModifyUpdateBtnFlag=true
this.TabDisable=true

}
TemplateSave1()
{
  if (this.TemplateTabIndex==0 && this.AlertObjarry.SmsorEmail=='S'  && !this.TemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
if (this.TemplateTabIndex==0 && this.AlertObjarry.SmsorEmail=='M'  && !this.MailTemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
if (this.TemplateTabIndex==0 && this.AlertObjarry.SmsorEmail=='B'  && !this.TemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
if (this.TemplateTabIndex==1 && this.AlertObjarry.SmsorEmail=='B'  && !this.MailTemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to save?</b>',
      nzOnOk: () => this.TemplateSave()
    });
}

TemplateSave(){
debugger
// this.MoreSelectarry[0].id
// this.TemplateTabIndex

if (this.AlertObjarry.SmsorEmail=='B'){
 

  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        id:                0,                                                                                           
        Euser :            this.currentUser.userCode,
        AlertID:           this.AlertObjarry.id,
        InsuranceType:     this.AlertObjarry.InsuranceType,
        InsCompanyID:      this.AlertObjarry.InsCompanyID,
        Template:          this.TemplateTabIndex==0?this.TemplateNg:this.MailTemplateNg,
        Status:            "Pending",
        CheckedBy:         this.currentUser.userCode,
        CheckedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        ApprovedBy:        this.currentUser.userCode,
        ApprovedDate:      moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        CreatedBy:         this.currentUser.userCode,
        CreatedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        LastUpdatedOn:     moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        SaveorUpdate:      "I",
        SmsorEmail:        this.AlertObjarry.SmsorEmail,
        SmsorEmailTab:     this.TemplateTabIndex==0?'S':'M'
      }],
    "requestId": "110",
    "outTblCount": "0"
  })
  .then((response) => {debugger
    if(response && response.errorCode==0)
    {
this.notification.success('Saved Successfully','')
this.isVisibleModal = false;
    }
    else
    {     
this.notification.error('Failed to save','')
    }
    
  });
}
else{
  debugger
  this.dataServ.getResponse({
    
    "batchStatus": "false",
    "detailArray":
      [{
        id:                0,                                                                                           
        Euser :            this.currentUser.userCode,
        AlertID:           this.AlertObjarry.id,
        InsuranceType:     this.AlertObjarry.InsuranceType,
        InsCompanyID:      this.AlertObjarry.InsCompanyID,
        Template:          this.AlertObjarry.SmsorEmail=='S'?this.TemplateNg:this.MailTemplateNg,
        Status:            "Pending",
        CheckedBy:         this.currentUser.userCode,
        CheckedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        ApprovedBy:        this.currentUser.userCode,
        ApprovedDate:      moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        CreatedBy:         this.currentUser.userCode,
        CreatedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        LastUpdatedOn:     moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        SaveorUpdate:       "I",
        SmsorEmail:        this.AlertObjarry.SmsorEmail,
        SmsorEmailTab:     this.AlertObjarry.SmsorEmail
      }],
    "requestId": "110",
    "outTblCount": "0"
  })
  .then((response) => {debugger
    if(response && response.errorCode==0)
    {
this.notification.success('Saved Successfully','')
this.isVisibleModal = false;
    }
    else
    {     
this.notification.error('Failed to save','')
    }
    
  });
}

}
/*Modify Code */

TemplateModify(){
  debugger
// this.MoreSelectarry[0].id
if (this.TemplateTabIndex==0 && this.AlertObjarry.SmsorEmail=='S'  && !this.TemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
if (this.TemplateTabIndex==0 && this.AlertObjarry.SmsorEmail=='M'  && !this.MailTemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
if (this.TemplateTabIndex==0 && this.AlertObjarry.SmsorEmail=='B'  && !this.TemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
if (this.TemplateTabIndex==1 && this.AlertObjarry.SmsorEmail=='B'  && !this.MailTemplateNg)
{
  this.notification.error('Please Enter the Template','')
   return false
}
// this.TemplateTabIndex
if (this.AlertObjarry.SmsorEmail=='B'){
 

  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        id:                this.TemplateTabIndex==0? this.TemplateID:this.TemplateIDMail,                                                                                         
        Euser :            this.currentUser.userCode,
        AlertID:           this.AlertObjarry.id,
        InsuranceType:     this.AlertObjarry.InsuranceType,
        InsCompanyID:      this.AlertObjarry.InsCompanyID,
        Template:          this.TemplateTabIndex==0?this.TemplateNg:this.MailTemplateNg,
        Status:            "Pending",
        CheckedBy:         this.currentUser.userCode,
        CheckedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        ApprovedBy:        this.currentUser.userCode,
        ApprovedDate:      moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        CreatedBy:         this.currentUser.userCode,
        CreatedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        LastUpdatedOn:     moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        SaveorUpdate:       "U",
        SmsorEmail:        this.AlertObjarry.SmsorEmail,
        SmsorEmailTab:     this.TemplateTabIndex==0?'S':'M'
      }],
    "requestId": "110",
    "outTblCount": "0"
  })
  .then((response) => {debugger
    if(response && response.errorCode==0)
    {
this.notification.success('Modified Successfully','')
this.isVisibleModal = false;
    }
    else
    {     
this.notification.error('Failed to Modify','')
    }
    
  });
}
else{
  debugger
  this.dataServ.getResponse({
    
    "batchStatus": "false",
    "detailArray":
      [{
        id:                this.AlertObjarry.SmsorEmail=='S'? this.TemplateID:this.TemplateIDMail,                                                                                           
        Euser :            this.currentUser.userCode,
        AlertID:           this.AlertObjarry.id,
        InsuranceType:     this.AlertObjarry.InsuranceType,
        InsCompanyID:      this.AlertObjarry.InsCompanyID,
        Template:          this.AlertObjarry.SmsorEmail=='S'?this.TemplateNg:this.MailTemplateNg,
        Status:            "Pending",
        CheckedBy:         this.currentUser.userCode,
        CheckedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        ApprovedBy:        this.currentUser.userCode,
        ApprovedDate:      moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        CreatedBy:         this.currentUser.userCode,
        CreatedDate:       moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        LastUpdatedOn:     moment(new Date()).format(AppConfig.dateFormat.apiMoment),
        SaveorUpdate:       "U",
        SmsorEmail:        this.AlertObjarry.SmsorEmail,
        SmsorEmailTab:     this.AlertObjarry.SmsorEmail
      }],
    "requestId": "110",
    "outTblCount": "0"
  })
  .then((response) => {debugger
    if(response && response.errorCode==0)
    {
this.notification.success('Modified Successfully','')
this.isVisibleModal = false;
    }
    else
    {     
this.notification.error('Failed to Modify','')
    }
    
  });
}
}

// handleOk() {
//   this.isVisibleModal = false;
// }

handleCancel() {
  this.isVisibleModal = false; 
}
saveBtnFlag()
{
  debugger
  if (this.AlertObjarry.SmsorEmail!='B')
{
  if ( this.TemplateIDMail || this.TemplateID)
  {
    this.SaveBtnFlag=false
    this.TabDisable=false
  }
  else{
    this.SaveBtnFlag=true
    this.TabDisable=true
  }
}
else
{
  if(this.TemplateTabIndex==0 && this.TemplateID)
  {
    this.SaveBtnFlag=false
    this.TabDisable=false
  }
  else if(this.TemplateTabIndex==1 && this.TemplateIDMail)
  {
    this.SaveBtnFlag=false
    this.TabDisable=false
  }
  else{
    this.SaveBtnFlag=true
    this.TabDisable=true
  }
  
}
}

}
