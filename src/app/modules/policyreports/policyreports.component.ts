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


export interface policyreportsForm {
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
  templateUrl: './policyreports.component.html',
  styleUrls: ['./policyreports.component.less']
})

export class policyreportsComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  insCompList: Array<any> = [];
  policyrpt: Array<any> = [];
  rpttype: Array<any> = [];
  model: policyreportsForm;
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
  typeid: number;
  checked:boolean=false
  checkRenewpolicy:any
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService

  ) {
    this.model = <policyreportsForm>{
      tranDate: new Date()

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );
    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: 'State',
      codeLabel: 'SateCode',
      descColumn: 'State',
      descLabel: 'State',
      hasDescInput: false,
      requestId: 2
    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      hasDescInput: false,
      requestId: 2
    }
    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      hasDescInput: false,
      requestId: 2
    }
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'Code',
      codeLabel: 'EmployeeCode',
      descColumn: 'Name',
      descLabel: 'Employee',
      hasDescInput: false,
      requestId: 2
    }
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
    this.SPFindopt = {
      findType: FindType.SPCODE,
      codeColumn: 'SpCode',
      codeLabel: 'SpCode',
      descColumn: 'SpCode',
      descLabel: 'SpCode',
      title: 'SP',
      hasDescInput: false,
      requestId: 2
    }
  }

  ngOnInit() {
    this.model.sORd = 'D'
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true
    this.formHdlr.config.showExportPdfBtn=false
    let date = new Date();
    this.model.td = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.getInsCompany();

    this.getReporttype();
    // this.rpttype = [{ Code: "Issuence", Description: "Issuance" }, { Code: "Commission", Description: "Commission" }, { Code: "Login", Description: "Login" }];
    // this.model.ReportType = this.rpttype[0].Code;
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
        this.getcategory()
      } else {

      }
    });
  }
  getReporttype() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 34
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
    this.treeData = [];
    this.isSpinning = true;
    this.policyrpt = [];
    this.data=[];
    debugger
    if (this.checked==true){
     this.checkRenewpolicy='Y'
    }
    else{
      this.checkRenewpolicy='N'
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ReportType: this.model.ReportType,
          InsCompanyID: this.model.insurancecompany,
          State: this.model.state ? this.model.state.State : '',
          Region: this.model.Region ? this.model.Region.Region : '',
          Location: this.model.Location ? this.model.Location.Location : '',
          Fromdate: this.model.fd ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment) : '',
          Todate: this.model.td ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment) : '',
          PolicyNo: this.model.Policy ? this.model.Policy : '',
          Product: this.model.Product ? this.model.Product.ProductCode : '',
          Employee: this.model.Employee ? this.model.Employee.EmployeeID : '',
          Euser: this.currentUser.userCode || '',
          SPCode: this.model.spCode ? this.model.spCode.SpCode : '',
          ProductCategory: this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : '',
          ViewType: this.model.sORd,
          Renewedpolicy: this.checkRenewpolicy



        }], 
      "requestId": "62"
    }).then((response) => {
      this.isSpinning = false;

      let res;
      if (response && response[0]) {
        if (this.model.sORd == 'D') {
          this.data = this.utilServ.convertToObject(response[0]);
          
          // console.log(this.data)
          this.policyrpt= Object.keys(this.data[0]);
          // this.policyrpt = this.utilServ.convertToObject(response[0]);
          if (this.policyrpt.length == 0) {
            this.notification.error('No data found', '')
            return;
          }
        }
        else {


          let companydata = this.utilServ.convertToObject(response[0]);
          let zoneData = this.utilServ.convertToObject(response[1]);
          let stateData = this.utilServ.convertToObject(response[2]);
          let regionData = this.utilServ.convertToObject(response[3]);
          let locationData = this.utilServ.convertToObject(response[4]);
  


          locationData = locationData.map((o) => {
            o.key = "location_" + o.Id;
            return o;

          });


          regionData = regionData.map((regdata) => {
            regdata.key = "region_" + regdata.Id;
            regdata.children = locationData.filter((locdata) => {
              return locdata.ParentId == regdata.Id
            });

            return regdata;
          });



          stateData = stateData.map((state) => {
            state.key = "state_" + state.Id;
            state.children = regionData.filter((reg) => {
              return reg.ParentId == state.Id
            });

            return state;
          });
          zoneData = zoneData.map((zone) => {
            zone.key = "zone_" + zone.Id;
            zone.children = stateData.filter((sta) => {
              return sta.ParentId == zone.Id
            });
            return zone;
          });
          companydata = companydata.map((company) => {
            company.ParentId = 0;
            company.key = "company_" + company.Id;
            company.children = zoneData.filter((zon) => {
              return zon.ParentId == company.Id
            });
            return company;
          });
          companydata.forEach(item => {
            debugger
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
          });
          // console.log(  this.mapOfExpandedData)
          let a = JSON.stringify(companydata)
          this.treeData = JSON.parse(a)
          if (this.treeData.length == 0) {
            this.notification.error('No data found', '')
            return;
          }




        }


      } else {
        if (this.policyrpt.length == 1) {
          this.notification.error('No data found', '')
        }
      }
    });
  }
  reset() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true
    this.formHdlr.config.showExportPdfBtn=false
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
    debugger
    this.checkRenewpolicy='N'
    this.checked=false

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
    debugger
    if (this.checked==true){
      this.checkRenewpolicy='Y'
     }
     else{
       this.checkRenewpolicy='N'
     }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ReportType: this.model.ReportType,
          InsCompanyID: this.model.insurancecompany,
          State: this.model.state ? this.model.state.State : '',
          Region: this.model.Region ? this.model.Region.Region : '',
          Location: this.model.Location ? this.model.Location.Location : '',
          Fromdate: this.model.fd ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment) : '',
          Todate: this.model.td ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment) : '',
          PolicyNo: this.model.Policy ? this.model.Policy : '',
          Product: this.model.Product ? this.model.Product.ProductCode : '',
          Employee: this.model.Employee ? this.model.Employee.EmployeeID : '',
          Euser: this.currentUser.userCode || '',
          SPCode: this.model.spCode ? this.model.spCode.SpCode : '',
          ProductCategory: this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : '',
          ViewType: this.model.sORd,
          Renewedpolicy: this.checkRenewpolicy


        }],
      "requestId": "62"
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


  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }
  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  setClickStyle(data) {
    
    if (data.key.startsWith("location_")) {
      return true;
    } else {
      return false;
    }
  }


  showPolicyDashboard(data): void {
    debugger

    if (data.key.startsWith("location_")) {


      const modal = this.modalService.create({
        nzTitle: 'Policy Details',
        nzContent: policywithlocationComponent,
        nzWidth: "80%",
        nzComponentParams:
        {
          "ReportType": this.model.ReportType,
          "InsCompanyID": this.model.insurancecompany,
          "State": this.model.state ? this.model.state.State : '',
          "Region": this.model.Region ? this.model.Region.Region : '',
          "Location": data.LocCode,
          "Fromdate": this.model.fd ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment) : '',
          "Todate": this.model.td ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment) : '',
          "PolicyNo": this.model.Policy ? this.model.Policy : '',
          "Product": this.model.Product ? this.model.Product.ProductCode : '',
          "Employee": this.model.Employee ? this.model.Employee.EmployeeID : '',
          "Euser": this.currentUser.userCode || '',
          "SPCode": this.model.spCode ? this.model.spCode.SpCode : '',
          "ProductCategory": this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : '',
          "ViewType": this.model.sORd,
          "From":'policyreport'
        },
        nzFooter: null
      });
    }
    else {
      return;
    }
  }


  reset_tabledata()
  {
    this.treeData = [];
   
    this.policyrpt = [];
    this.data=[];
  }

  sortstate(data)
  {
    debugger
    if(data == null)
    {
      this.stateCodeValue =''
  
    }else
    {
      this.stateCodeValue =data.State
    }
  
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      hasDescInput: false,
      requestId: 2,
      whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
    }
  
      this.RegionFindopt = {
        findType: FindType.Region,
        codeColumn: 'Region',
        codeLabel: 'RegionCode',
        descColumn: 'RegionName',
        descLabel: 'Region',
        hasDescInput: false,
        requestId: 2,
        whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
      }
  this.model.Location=null;
  this.model.Region=null;
  this.reset_tabledata()
  }
  onchange_reg(data)
  {debugger
    if(data == null)
    {
      this.stateCodeValue =''
  
    }else
    {
      this.regionvalue =data.RegionName
    }
  
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      hasDescInput: false,
      requestId: 2,
      whereClause :this.regionvalue?"regionname ='" + this.regionvalue  + "'": ''
    }
    this.model.Location=null;
    this.reset_tabledata()
  }

  getcategory()
  {debugger
    this.model.pdtCategory=null
    this.typeid=0
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
           companyid: this.model.insurancecompany? this.model.insurancecompany:0,
           Euser:this.currentUser.userCode
          }],
        "requestId": "94"
      }).then((response) => {
        let res;
        if (response && response[0]) {debugger
          let data = this.utilServ.convertToObject(response[0]);
          this.typeid = data[0].id;
  
          // console.log(this.typeid)
  
          this.productcategoryFindopt = {
            findType: FindType.ProductCategory,
            codeColumn: 'CategoryCode',
            codeLabel: 'CategoryCode',
            descColumn: 'CategoryName',
            descLabel: 'CategoryName',
            whereClause: this.typeid?"ProductTypeId = '"+this.typeid +"'":'1=1',
            hasDescInput: false,
            requestId: 2
          }
  
  
        } else {
          // this.notif.error = "No Data Found";
        }
      });
  
    
  this.reset_tabledata()
  }
  getproduct()
{

  this.model.Product=null

  this.ProductFindopt = {
    findType: FindType.Product,
    codeColumn: 'ProductCode',
    codeLabel: 'ProductCode',
    descColumn: 'ProductName',
    descLabel: 'Product',
    whereClause: this.model.pdtCategory?"CategoryID = '"+this.model.pdtCategory.CategoryID +"'":'1=1',
    hasDescInput: false,
    requestId: 2

  }

  this.reset_tabledata()
}

}
