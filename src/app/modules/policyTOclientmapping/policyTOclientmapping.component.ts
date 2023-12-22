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


export interface policyTOclientmappingForm {
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
  selector: 'app-policyTOclientmapping',
  templateUrl: './policyTOclientmapping.component.html',
  styleUrls: ['./policyTOclientmapping.component.less'],

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
export class policyTOclientmappingComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;


  model: policyTOclientmappingForm;
  reconProcessList: Array<any> = [];
  insCompList: Array<any> = [];
  currentUser: User;
  FormControlNames: {} = {};
  completedProcess;
  locationFindopt: FindOptions;
  productcategoryFindopt: FindOptions;
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
  Records: any=[];
  isSpinning:boolean =false

  Columns: any;
  policyNumber: any;
  showLeftSide:boolean =true
  Next: any =0;
  isVisible: boolean=false;
  pendinglist: any;
  Head: any;
  




  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private modalService: NzModalService,
    private validServ: ValidationService,
    private notif: NzNotificationService) {
    this.model = <policyTOclientmappingForm>{};
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      hasDescInput: false,
      requestId: 2,
      whereClause: ''
    }
    this.productcategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: 'CategoryCode',
      codeLabel: 'CategoryCode',
      descColumn: 'CategoryName',
      descLabel: 'CategoryName',
      title: 'Product Category',
      hasDescInput: false,
      requestId: 2
    }
  }

  ngOnInit() {
     
   this.Next=0
    this.CName = true;
    this.CLocation = true;
    this.CCity = true;
    this.CAddress = true;
    this.CEmail = true;
    this.CMobileC = true;
    this.CPAN = true;

    this.model.LorE = 'L'
    this.model.IorB = 'I'
    this.reconProcessList = [];
    this.model.fromDate = new Date();
    this.model.toDate = new Date();
    this.isVisible = true;
    // this.getInsuranceCompany();
    this.getInsuerType();
    this.getproductwithcompany();
    this.getpendinglist();

  }

  getInsuranceCompany() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          InsuerType: this.model.InsurerType == 'ALL' ? '' : this.model.InsurerType ? this.model.InsurerType : ''
        }],
      "requestId": "139"
    }).then((response) => {
       

      let res;
      if (response && response[0]) {
        this.insCompList = this.utilServ.convertToObject(response[0]);
        this.model.insCompany = this.insCompList[0].Code;
      } else {

      }
    });
    this.getcategorywithtype()
    this.tablelist = []
    this.getpendinglist();
  }

  getproductwithcompany() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          Company: this.model.insCompany == 0 ? 0 : this.model.insCompany ? this.model.insCompany : 0

        }],
      "requestId": "69"
    }).then((response) => {
       

      let res;
      if (response && response[0]) {
        this.product = this.utilServ.convertToObject(response[0]);
        this.model.ProductCodeorName = this.product[0].Code;
      } else {

      }
    });

    this.tablelist = []
    this.getpendinglist();
  }

  getInsuerType() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,

        }],
      "requestId": "140"
    }).then((response) => {
       

      let res;
      if (response && response[0]) {
        this.Insuertype = this.utilServ.convertToObject(response[0]);
        this.model.InsurerType = this.Insuertype[0].Type;
       this.getInsuranceCompany()
      } else {

      }
    });
    this.tablelist = []
  }

  view(data) {

    if(data == 0)
    {
this.Next =0
    }
    else
    {
      this.Next = this.Next +1
    }
    this.policyNumber=''
    this.tablelist=[];
    this.Findlist=[];
    this.CName = true;
    this.CLocation = true;
    this.CCity = true;
    this.CAddress = true;
    this.CEmail = true;
    this.CMobileC = true;
    this.CPAN = true;
    let ProductCat = 0
    if (this.model.pdtCategory) {
      ProductCat = this.model.pdtCategory.CategoryID ? this.model.pdtCategory.CategoryID : 0
    }

    if (this.model.insCompany== null || this.model.insCompany == undefined || this.model.insCompany =='' || this.model.insCompany==0 ) {

      this.notif.error('Select Company', '')
      return
    }
    if (this.model.InsurerType== null || this.model.InsurerType == undefined || this.model.InsurerType =='') {

      this.notif.error('Select Insure Type', '')
      return
    }

    if (this.model.fromDate == null || this.model.fromDate == undefined) {

      this.notif.error('Select Valid From Date', '')
      return
    }

    if (this.model.toDate == null || this.model.fromDate == undefined) {

      this.notif.error('Select Valid To Date', '')
      return
    }
   
this.isSpinning =true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyID: this.model.insCompany ? this.model.insCompany : 0,
          InsurerType: this.model.InsurerType ? this.model.InsurerType : 'ALL',
          ProductCategoryId: ProductCat,
          ProductCode: this.model.ProductCodeorName ? this.model.ProductCodeorName : 'ALL',
          PolicyNumber: this.model.Policyno ? this.model.Policyno : 'ALL',
          FromDate: moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment),
          ToDate: moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment),
          Excelexport:0,
          Next:this.Next?this.Next:0

        }],
      "requestId": "68"
    }).then((response) => {
      this.isSpinning =false
      this.showLeftSide=true
       
      let res;
      if (response && response[0]) { 
        this.tablelist = this.utilServ.convertToObject(response[0]);

        if (this.tablelist.length) {
          let data = this.tablelist[0]
          this.model.Name = data.CustomerName;
          this.model.City = data.City;
          this.model.Address = data.Address;
          this.model.Email = data.Email;
          this.model.Mobile = data.Mobile;
          this.model.PAN = data.PAN;
          this.model.Location = { LocationName: data.Location, Location: data.Location }
          this.policyNumber=data.PolicyNumber
          

          this.Find()
        }
        else {
          this.notif.error('No Data', '')
        }

      } else {
        this.notif.error(response.errorMsg, '')
      }
    });
  }







  ClearData() {
    this.ngOnInit();
  }


  getcategorywithtype() {
    this.productcategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: 'CategoryCode',
      codeLabel: 'CategoryCode',
      descColumn: 'CategoryName',
      descLabel: 'CategoryName',
      title: 'Product Category',
      hasDescInput: false,
      requestId: 2,
      whereClause: this.model.InsurerType == 'ALL' ? '' : this.model.InsurerType ? "ProductType ='" + this.model.InsurerType + "'" : ''
    }


  }

  Find() { 
    this.isSpinning =true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          SearchType: this.model.LorE ? this.model.LorE : '',
          SearchFrom: this.model.IorB == 'I' ? 'Insurance' : 'Insurance BO',
          Name: this.CName ? this.model.Name : '',
          Location: this.CLocation ? this.model.Location.LocationName : '',
          City: this.CCity ? this.model.City : '',
          Address: this.CAddress ? this.model.Address : '',
          Email: this.CEmail ? this.model.Email : '',
          Mobile: this.CMobileC ? this.model.Mobile : '',
          Pan: this.CPAN ? this.model.PAN : '',
           PolicyNumber :this.policyNumber?this.policyNumber:''

        }],
      "requestId": "70"
    }).then((response) => {
       
      this.isSpinning =false
      let res;
      if (response && response[0]) {
        this.Findlist = this.utilServ.convertToObject(response[0]);
        if (!this.Findlist.length) {
          this.notif.error('No Data', '')
        }

      } else {
        this.notif.error('No Data', '')

      }
    });
  }



  onchangecat() {
    this.tablelist = []
  }
  onchange() {
    this.Findlist = []
  }


  exportData() {
    let ProductCat = 0
    if (this.model.pdtCategory) {
      ProductCat = this.model.pdtCategory.CategoryID ? this.model.pdtCategory.CategoryID : 0
    }

    if (this.model.fromDate == null || this.model.fromDate == undefined) {

      this.notif.error('Select Valid From Date', '')
      return
    }

    if (this.model.toDate == null || this.model.fromDate == undefined) {

      this.notif.error('Select Valid To Date', '')
      return
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyID: this.model.insCompany ? this.model.insCompany : 0,
          InsurerType: this.model.InsurerType ? this.model.InsurerType : 'ALL',
          ProductCategoryId: ProductCat,
          ProductCode: this.model.ProductCodeorName ? this.model.ProductCodeorName : 'ALL',
          PolicyNumber: this.model.Policyno ? this.model.Policyno : 'ALL',
          FromDate: moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment),
          ToDate: moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment),
          Excelexport:1


        }],
      "requestId": "68"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.Records = this.utilServ.convertToResultArray(response[0]);

        if(!this.Records.length)
        {
          this.notif.error('No Data Found','') ;
          return;
        }
        this.Columns = response[0].metadata.columns;
        this.Excel(this.Columns, this.Records, 'PolicyMapping');
      } else {
         this.notif.error('No Data Found','') ;
      }
    });
  }


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

    let blob = new Blob([this.html], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, "Policy Report.xls");
    this.isProcessing = false;

  }

  Reset() {
    this.ngOnInit();
    this.tablelist = [];
    this.Findlist = [];
    this.Next=0
    this.model.Policyno='';
    this.model.pdtCategory=null
    

  }

update(data)
  { 

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          IorB :this.model.IorB,
          Clientid :data.ClientID?data.ClientID:0,
          PolicyNo : this.policyNumber? this.policyNumber:'',
          Euser : this.currentUser.userCode,
          Pan : data.PAN,
          InsCompanyID : this.model.insCompany ? this.model.insCompany : 0,

        }],
      "requestId": "71"
    }).then((response) => {
      
      
      if (response && !response.errorCode) {
       
        this.notif.success('Data Updated Successfully', '')

        // this.tablelist=[];
        // this.Findlist=[];
        this.view(1)
      } else {
        this.notif.error('Error', '')

      }
    });
  }
  
  save(data) {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to tag this client ?</b>',
      nzOnOk: () =>{this.update(data)}
    });
  }

  toggleCenter() {
     
    if (!this.showLeftSide) {
      this.showLeftSide = true;
    }
    else {
      this.showLeftSide = false;
    }
  }

  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }


  getpendinglist() {
     
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          InsCompanyID: this.model.insCompany ? this.model.insCompany : 0,
        }],
      "requestId": "78"
    }).then((response) => {
       
      if (response && response[0]) {
        let data= this.utilServ.convertToObject(response[0]);
        this.pendinglist = data[0].Pending;
        this.Head=data[0].Head 
      } else {

      }
    });
  }

}
