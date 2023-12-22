import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';

import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';

import { UtilService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { AppConfig } from 'shared';
import * as FileSaver from 'file-saver';
// import { PolicyDetailsComponent } from "../policy-details/policy-details.component";
import { User } from 'shared/lib/models/user';
import { InputMasks } from 'shared';
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";
import { policywithlocationComponent } from '../policywithlocation/policywithlocation.component';


export interface commissionreconculiationForm {
  sORd: string;
  tranDate: Date;
  insCompany: string;
  state: any;
  Region: any;
  Location: any;
  Employee: any;
  Product: any;
  Policy: string;
  fd: Date;
  td: Date;
  insurancecompany: string;
  ReportType: string;
  spCode: any;
  pdtCategory: any;
  category: any;


}

export interface TreeNodeInterface {
  key: number;
  Id: number;
  Name: string;
  Premium_Collected: number;
  No_Of_Policies: number;
  Commission: number;
  Annualised_Premium: number;
  expand: boolean;
  children?: TreeNodeInterface[];
}

@Pipe({
  name: 'tableFilter',
})
export class TableFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => {
      let flag = false;

      if (item[filter.key] && item[filter.key] == filter.value)
        flag = true;
      return flag;
    })
  }
}

@Component({
  templateUrl: './commissionreconculiation.component.html',
  styleUrls: ['./commissionreconculiation.component.less']
})

export class commissionreconculiationComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  insCompList: Array<any> = [];
  policyrpt: Array<any> = [];
  rpttype: Array<any> = [];
  model: commissionreconculiationForm;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  ProductFindopt: FindOptions;
  SPFindopt: FindOptions;
  productcategoryFindopt: FindOptions;
  location: any;
  isVisible: any;
  branchcode: any;
  columnArray = [];
  numericarray = [];
  brancharray = [];
  Records: Array<any> = [];
  Columns: Array<any> = [];
  html;
  isProcessing;
  currentUser: User;
  treeData: Array<TreeNodeInterface> = [];
  mapOfExpandedData: any = {};
  inputMasks = InputMasks;
  isSpinning: boolean = false;
  Viewtype: boolean = true;
  data: any=[];
  stateCodeValue: string;
  regionvalue: any;
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService

  ) {
    this.model = <commissionreconculiationForm>{
      tranDate: new Date()

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );
    
   
    this.ProductFindopt = {
      findType: FindType.Product,
      codeColumn: 'ProductCode',
      codeLabel: 'ProductCode',
      descColumn: 'ProductName',
      descLabel: 'Product',
      hasDescInput: false,
      requestId: 2
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
    
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true
    let date = new Date();
    this.model.td = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.getInsCompany();

    this.getReporttype();
 
  }

  getInsCompany() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 20
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.insCompList = this.utilServ.convertToObject(response[0]);
        this.model.insurancecompany = this.insCompList[1].Code;
      } else {

      }
    });
  }
  getReporttype() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 45
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.rpttype = this.utilServ.convertToObject(response[0]);
        this.model.ReportType = this.rpttype[0].Code;
      } else {

      }
    });
  }
  preview() {
   
    this.isSpinning = true;
    this.policyrpt = [];
    this.data=[];
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
       
          REPORTTYPE:this.model.ReportType,
          COMPANYID: this.model.insurancecompany,
          FROMDATE: this.model.fd ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment) : '',
          TODATE : this.model.td ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment) : '',
          POLICYNO: this.model.Policy ? this.model.Policy : '',
          PRODUCT: this.model.Product ? this.model.Product.ProductCode : '',
          USERCODE: this.currentUser.userCode || '',
          PRODUCTCATEGORY: this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : '',
        }], 
      "requestId": "63"
    }).then((response) => {
      this.isSpinning = false;

      
      if (response && response[0]) {
          this.data = this.utilServ.convertToObject(response[0]);
      } 
      else {
          this.notification.error('No data found', '')
      }
    });
  }
  reset() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true
    this.getInsCompany();
    this.getReporttype();
    this.model.state = '';
    this.model.Region = '';
    this.data=[];
    this.model.Location = '';
    let date = new Date();
    this.model.td = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.Employee = '';
    this.model.Product = '';
    this.model.Policy = '';
    this.policyrpt = [];
    this.model.spCode = '';
    this.model.pdtCategory = '';
    this.treeData=[];
    this.model.category = '';

  }
  showModal(): void {

    this.isVisible = true
  }

  handleOk(): void {

    this.isVisible = false;
  }

  handleCancel(): void {

    this.isVisible = false;
  }

  createComponentModal(data): void {
    debugger

    const modal = this.modalService.create({
      nzTitle: 'Policy Details',
      nzContent: PolicyDetailsComponent,
      nzWidth: "80%",
      nzComponentParams:
      {
        "policyNo": data.policyNumber,
        "Euser": this.currentUser.userCode,
      },
      nzFooter: null
    });
  }
  exportData() {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          REPORTTYPE:this.model.ReportType,
          COMPANYID: this.model.insurancecompany,
          FROMDATE: this.model.fd ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment) : '',
          TODATE : this.model.td ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment) : '',
          POLICYNO: this.model.Policy ? this.model.Policy : '',
          PRODUCT: this.model.Product ? this.model.Product.ProductCode : '',
          USERCODE: this.currentUser.userCode || '',
          PRODUCTCATEGORY: this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : '',

        }],
      "requestId": "63"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.Records = this.utilServ.convertToResultArray(response[0]);
        if (this.Records.length == 0) {
          this.notification.error('No Data Found', '');
          return;
        }
        this.Columns = response[0].metadata.columns;
        this.Excel(this.Columns, this.Records, this.policyrpt);
        this.notification.success('Success', '');
      } else {
        this.notification.error('No Data Found', '');
      }
    });
  }

  //export to excel
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
    // let blob = new Blob([document.getElementById('clientassetrpt').innerHTML], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    //     });
    //  FileSaver.saveAs(blob, "ClientAssetReport.xls");
  }

  setviewtype() {debugger
    this.treeData=[];
    this.data=[];
    this.policyrpt=[];
   
  }



  reset_tabledata()
  {
    this.treeData = [];
   
    this.policyrpt = [];
    this.data=[];
  }

}
